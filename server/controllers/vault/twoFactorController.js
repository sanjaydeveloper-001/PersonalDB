import User from '../../models/common/User.js';
import crypto from 'crypto';
import {
  generate2FASecret,
  verifyOTP,
  enable2FA,
  disable2FA as disableTwoFactorAuth,
  getDecryptedSecret,
  get2FAStatus,
} from '../../services/twoFactorAuth.js';
import { send2FADisableEmail } from '../../services/email/emailService.js';

/**
 * Generate 2FA secret - Step 1 of enabling 2FA
 * Returns QR code and manual code
 */
export const generate2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.twoFactorAuth?.enabled) {
      return res.status(400).json({ message: '2FA is already enabled. Disable it first.' });
    }

    const { secret, qrCode, manualCode, backupCodes } = await generate2FASecret(
      user._id,
      user.email || user.username
    );

    // Store in session for verification (don't save to DB yet)
    req.session.temp2FASetup = {
      secret,
      backupCodes,
      createdAt: Date.now(),
    };

    res.json({
      qrCode,
      manualCode,
      backupCodes,
      message: 'Scan the QR code with your authenticator app. You have 10 minutes to complete setup.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify 2FA setup - Step 2 of enabling 2FA
 * User enters 6-digit code from authenticator
 */
export const verify2FASetup = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token.length !== 6 || isNaN(token)) {
      return res.status(400).json({ message: 'Invalid token. Please enter 6 digits.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if temp setup exists
    if (!req.session.temp2FASetup) {
      return res.status(400).json({ message: 'Please generate 2FA setup first.' });
    }

    // Check if setup expired (10 minutes)
    const setupAge = Date.now() - req.session.temp2FASetup.createdAt;
    if (setupAge > 10 * 60 * 1000) {
      delete req.session.temp2FASetup;
      return res.status(400).json({ message: 'Setup expired. Please generate again.' });
    }

    const { secret, backupCodes } = req.session.temp2FASetup;

    // Verify the token
    const isValid = verifyOTP(secret, token);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid code. Please check and try again.' });
    }

    // Enable 2FA on user
    enable2FA(user, secret, backupCodes);
    await user.save();

    // Clean up session
    delete req.session.temp2FASetup;

    res.json({
      message: '2FA enabled successfully!',
      status: { enabled: true, backupCodesRemaining: 10 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable 2FA
 * User must provide password for security
 */
export const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to disable 2FA' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.twoFactorAuth?.enabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Disable 2FA
    disableTwoFactorAuth(user);
    await user.save();

    res.json({ message: '2FA disabled successfully', status: { enabled: false } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get 2FA status
 */
export const get2FAStatusAPI = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const status = get2FAStatus(user);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Request 2FA disable via email
 * Sends verification email to user
 */
export const request2FADisableEmail = async (req, res) => {
  try {
    // Support both authenticated users and users in pending 2FA flow
    let userId;
    if (req.user?._id) {
      userId = req.user._id;
    } else if (req.session?.pendingUser?.userId) {
      userId = req.session.pendingUser.userId;
    } else {
      return res.status(401).json({ message: 'No token' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.twoFactorAuth?.enabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Generate disable token (valid for 30 minutes)
    const disableToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(disableToken).digest('hex');

    user.twoFactorAuth.disableToken = {
      hash: tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };

    await user.save();

    // Send disable email
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await send2FADisableEmail(user.email, user.username, disableToken, frontendUrl);

    res.json({
      message: 'Verification email sent. Check your email to disable 2FA.',
    });
  } catch (error) {
    console.error('[request2FADisableEmail] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify 2FA disable token and disable 2FA
 * Token comes from email link
 */
export const verify2FADisableToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Disable token is required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token
    const user = await User.findOne({
      'twoFactorAuth.disableToken.hash': tokenHash,
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired disable token' });
    }

    // Check if token expired
    if (new Date() > user.twoFactorAuth.disableToken.expiresAt) {
      user.twoFactorAuth.disableToken = undefined;
      await user.save();
      return res.status(401).json({ message: 'Disable token has expired. Request a new one.' });
    }

    // Disable 2FA
    disableTwoFactorAuth(user);
    user.twoFactorAuth.disableToken = undefined;
    await user.save();

    res.json({
      message: '2FA has been disabled successfully.',
      status: { enabled: false },
    });
  } catch (error) {
    console.error('[verify2FADisableToken] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
