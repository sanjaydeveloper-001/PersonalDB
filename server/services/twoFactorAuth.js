import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
// IMPORTANT: Use consistent key. For production, set ENCRYPTION_KEY env var
// For development, we use a fixed key so encryption/decryption works across restarts
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff';

/**
 * Encrypt sensitive data (secret, backup codes)
 */
function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
function decryptData(encryptedData) {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt 2FA data');
  }
}

/**
 * Generate 2FA secret and QR code
 * Called when user initiates 2FA setup
 */
export async function generate2FASecret(userId, userEmail) {
  try {
    const secret = speakeasy.generateSecret({
      name: `PersonalDB (${userEmail})`,
      issuer: 'PersonalDB',
      length: 32,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Generate 10 backup codes (for account recovery)
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    return {
      secret: secret.base32,
      qrCode,
      manualCode: secret.base32, // User can enter this manually
      backupCodes,
    };
  } catch (error) {
    throw new Error(`Failed to generate 2FA secret: ${error.message}`);
  }
}

/**
 * Verify OTP token (6-digit code from authenticator app)
 */
export function verifyOTP(secret, token) {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: String(token),
      window: 1, // Allow 1 time window (30 second) drift
    });
  } catch (error) {
    return false;
  }
}

/**
 * Enable 2FA - save encrypted secret and backup codes to user
 */
export function enable2FA(user, secret, backupCodes) {
  if (!user) throw new Error('User not found');

  user.twoFactorAuth = {
    enabled: true,
    secret: encryptData(secret),
    backupCodes: backupCodes.map(code => encryptData(code)),
  };

  return user;
}

/**
 * Disable 2FA
 */
export function disable2FA(user) {
  if (!user) throw new Error('User not found');

  user.twoFactorAuth = {
    enabled: false,
    secret: null,
    backupCodes: [],
  };

  return user;
}

/**
 * Get decrypted secret for verification
 */
export function getDecryptedSecret(user) {
  if (!user.twoFactorAuth?.secret) {
    return null;
  }

  try {
    return decryptData(user.twoFactorAuth.secret);
  } catch (error) {
    console.error('Failed to decrypt secret:', error.message);
    return null;
  }
}

/**
 * Check if backup code is valid and consume it
 */
export function verifyAndConsumeBackupCode(user, code) {
  if (!user.twoFactorAuth?.backupCodes?.length) {
    return false;
  }

  try {
    for (let i = 0; i < user.twoFactorAuth.backupCodes.length; i++) {
      const decrypted = decryptData(user.twoFactorAuth.backupCodes[i]);
      if (decrypted === code.toUpperCase()) {
        // Remove used backup code
        user.twoFactorAuth.backupCodes.splice(i, 1);
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get 2FA status
 */
export function get2FAStatus(user) {
  return {
    enabled: user.twoFactorAuth?.enabled || false,
    backupCodesRemaining: user.twoFactorAuth?.backupCodes?.length || 0,
  };
}

export default {
  generate2FASecret,
  verifyOTP,
  enable2FA,
  disable2FA,
  getDecryptedSecret,
  verifyAndConsumeBackupCode,
  get2FAStatus,
};
