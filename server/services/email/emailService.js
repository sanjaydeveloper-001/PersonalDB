import bcrypt from 'bcryptjs';
import transporter from './transporter.js';
import {
  otpEmailTemplate,
  welcomeEmailTemplate,
  verificationEmailTemplate,
  accountDeletedTemplate,
  passwordChangedTemplate,
  contactFormTemplate,
  reviewApprovedTemplate,
  reviewRejectedTemplate,
} from './templates.js';

// ── Helper function to send email ─────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"PersonalDB" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error(`[Email] Failed to send ${subject} to ${to}:`, error.message);
    throw error;
  }
};

// ── Async email sender (fire-and-forget) ──────────────────────────────────────
// This sends emails in the background without blocking responses
const sendEmailAsync = (to, subject, html) => {
  // Don't await — let it run in background
  sendEmail(to, subject, html).catch(err => {
    console.error(`[Email] Background send failed for ${subject} to ${to}:`, err.message);
  });
};

// ────────────────────────────────────────────────────────────────────────────────
// EMAIL SENDING FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Send OTP for password reset
 * @param {string} email - User's email
 * @param {string} otp - Generated OTP
 */
export const sendOtpEmail = async (email, otp) => {
  return sendEmail(
    email,
    'Your Password Reset OTP',
    otpEmailTemplate(otp)
  );
};

/**
 * Send welcome email to new user (async, non-blocking)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendWelcomeEmail = async (email, username) => {
  return sendEmail(
    email,
    'Welcome to PersonalDB!',
    welcomeEmailTemplate(username)
  );
};

/**
 * Send welcome email asynchronously (fire-and-forget for OAuth/immediate redirects)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendWelcomeEmailAsync = (email, username) => {
  sendEmailAsync(
    email,
    'Welcome to PersonalDB!',
    welcomeEmailTemplate(username)
  );
};

/**
 * Send email verification link
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} verificationLink - Email verification link
 */
export const sendVerificationEmail = async (email, username, verificationLink) => {
  return sendEmail(
    email,
    'Verify Your Email',
    verificationEmailTemplate(username, verificationLink)
  );
};

/**
 * Send account deletion confirmation
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendAccountDeletedEmail = async (email, username) => {
  return sendEmail(
    email,
    'Account Deletion Confirmation',
    accountDeletedTemplate(username)
  );
};

/**
 * Send account deletion confirmation asynchronously (fire-and-forget)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendAccountDeletedEmailAsync = (email, username) => {
  sendEmailAsync(
    email,
    'Account Deletion Confirmation',
    accountDeletedTemplate(username)
  );
};

/**
 * Send password changed confirmation (async, non-blocking)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendPasswordChangedEmail = async (email, username) => {
  return sendEmail(
    email,
    'Password Changed',
    passwordChangedTemplate(username)
  );
};

/**
 * Send password changed confirmation asynchronously (fire-and-forget)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendPasswordChangedEmailAsync = (email, username) => {
  sendEmailAsync(
    email,
    'Password Changed',
    passwordChangedTemplate(username)
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// OTP MANAGEMENT FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Generate and send OTP for password reset
 * @param {Object} user - User document
 * @param {string} email - User's email
 */
export const generateAndSendOtp = async (user, email) => {
  try {
    // Generate 6-digit OTP
    const crypto = await import('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user document
    user.otpHash = otpHash;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('[Email] Failed to generate and send OTP:', error.message);
    throw error;
  }
};

/**
 * Verify OTP and return reset token
 * @param {Object} user - User document
 * @param {string} otp - OTP provided by user
 * @param {Function} generateToken - Token generation function
 */
export const verifyOtpAndGetToken = async (user, otp, generateToken) => {
  try {
    if (!user.otpHash || !user.otpExpiry) {
      throw new Error('No OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpiry) {
      user.otpHash = undefined;
      user.otpExpiry = undefined;
      await user.save();
      throw new Error('OTP has expired. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      throw new Error('Invalid OTP. Please try again.');
    }

    // OTP is valid — issue a short-lived reset token
    const resetToken = generateToken(user._id, '15m');

    // Clear OTP fields
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { success: true, resetToken, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('[Email] Failed to verify OTP:', error.message);
    throw error;
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// CONTACT FORM EMAIL FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Send contact form submission to admin (async, non-blocking)
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} issueType - Type of issue
 * @param {string} message - User's message
 */
export const sendContactEmailAsync = (username, email, issueType, message) => {
  // Don't await — let it run in background
  sendEmail(
    process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    `User - PersonalDB - New Contact: ${issueType.toUpperCase()}`,
    contactFormTemplate(username, email, issueType, message)
  ).catch(err => {
    console.error('[Email] Background contact email send failed:', err.message);
  });
};

// ────────────────────────────────────────────────────────────────────────────────
// 2FA DISABLE FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Send 2FA disable verification email with token
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} disableToken - Verification token
 * @param {string} frontendUrl - Frontend URL for verification link
 */
export const send2FADisableEmail = async (email, username, disableToken, frontendUrl = 'http://localhost:5173') => {
  const verifyLink = `${frontendUrl}/verify-2fa-disable?token=${disableToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #dc2626; margin-bottom: 8px;">Disable Two-Factor Authentication</h2>
      <p style="color: #475569;">We received a request to disable 2FA on your PersonalDB account. Click the link below to confirm:</p>
      
      <div style="margin: 24px 0;">
        <a href="${verifyLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Disable 2FA</a>
      </div>
      
      <p style="color: #94a3b8; font-size: 0.85rem;">Or copy this link:</p>
      <p style="color: #1e40af; font-size: 0.85rem; word-break: break-all;">${verifyLink}</p>
      
      <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 24px;">This link is valid for <strong>30 minutes</strong>. If you did not request this, please ignore this email.</p>
    </div>
  `;
  
  return sendEmail(email, 'Disable Two-Factor Authentication', html);
};

/**
 * Send 2FA disable verification email asynchronously
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} disableToken - Verification token
 * @param {string} frontendUrl - Frontend URL for verification link
 */
export const send2FADisableEmailAsync = (email, username, disableToken, frontendUrl) => {
  send2FADisableEmail(email, username, disableToken, frontendUrl).catch(err => {
    console.error('[Email] 2FA disable email send failed:', err.message);
  });
};

/**
 * Send review approved email
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendReviewApprovedEmail = async (email, username) => {
  const html = reviewApprovedTemplate(username);
  return sendEmail(email, '✓ Your PersonalDB Review Has Been Approved!', html);
};

/**
 * Send review approved email asynchronously (non-blocking)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendReviewApprovedEmailAsync = (email, username) => {
  sendReviewApprovedEmail(email, username).catch(err => {
    console.error('[Email] Review approved email send failed:', err.message);
  });
};

/**
 * Send review rejected email
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendReviewRejectedEmail = async (email, username) => {
  const html = reviewRejectedTemplate(username);
  return sendEmail(email, 'Review Not Approved - PersonalDB', html);
};

/**
 * Send review rejected email asynchronously (non-blocking)
 * @param {string} email - User's email
 * @param {string} username - User's username
 */
export const sendReviewRejectedEmailAsync = (email, username) => {
  sendReviewRejectedEmail(email, username).catch(err => {
    console.error('[Email] Review rejected email send failed:', err.message);
  });
};
