import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../../models/common/User.js';
import { generateToken } from '../../utils/generateToken.js';
import { generateSignedUrl } from './uploadController.js';

// ── Email transporter ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

// ── Register ──────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { username, password, birthYear, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    if (email && await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      username,
      password,
      birthYear,
      email: email || undefined,
    });

    res.cookie('token', generateToken(user._id), cookieOptions());
    res.status(201).json({ _id: user._id, username: user.username, birthYear: user.birthYear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.cookie('token', generateToken(user._id), cookieOptions());
      return res.json({ _id: user._id, username: user.username, birthYear: user.birthYear });
    }
    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

// ── Get current user ──────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select('-password -otpHash -otpExpiry').lean();
    
    // Attach signed URL if user has a profile image
    if (user.profileImage?.startsWith('avatars/')) {
      try {
        user.profileImage = await generateSignedUrl(user.profileImage, 3600);
      } catch (err) {
        console.warn('[getMe] Could not generate signed URL:', err.message);
      }
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Verify password ───────────────────────────────────────────────────────────
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Password verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Change password ───────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete account ────────────────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password. Account not deleted.' });

    await User.findByIdAndDelete(req.user._id);
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Send OTP for password reset ───────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpHash = otpHash;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: `"PersonalDB" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e40af; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #475569;">Use the OTP below to reset your PersonalDB password. It is valid for <strong>10 minutes</strong>.</p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px 32px; text-align: center; margin: 24px 0;">
            <span style="font-size: 2.5rem; font-weight: 700; letter-spacing: 0.3em; color: #1e40af;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent to your email address' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Verify OTP ────────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (!user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (new Date() > user.otpExpiry) {
      user.otpHash = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid OTP. Please try again.' });

    // OTP is valid — issue a short-lived reset token so the client can call resetPassword
    const resetToken = generateToken(user._id, '15m');

    // Clear OTP fields
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Reset password (after OTP verification) ───────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    // req.user is populated by the protect middleware using the resetToken
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Notification preferences ──────────────────────────────────────────────────
export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences.notifications');
    res.json(user?.preferences?.notifications || {
      loginAlerts: true,
      weeklyDigest: false,
      productUpdates: true,
      securityAlerts: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.preferences = user.preferences || {};
    user.preferences.notifications = req.body;
    await user.save();
    res.json({ message: 'Notification preferences updated', preferences: user.preferences.notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Appearance preferences ────────────────────────────────────────────────────
export const getAppearancePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences.appearance');
    res.json(user?.preferences?.appearance || { theme: 'system', language: 'en', timezone: 'UTC' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppearancePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.preferences = user.preferences || {};
    user.preferences.appearance = req.body;
    await user.save();
    res.json({ message: 'Appearance preferences updated', preferences: user.preferences.appearance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Privacy preferences ───────────────────────────────────────────────────────
export const getPrivacyPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences.privacy');
    res.json(user?.preferences?.privacy || { activityLog: true, analyticsSharing: false, publicProfile: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePrivacyPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.preferences = user.preferences || {};
    user.preferences.privacy = req.body;
    await user.save();
    res.json({ message: 'Privacy preferences updated', preferences: user.preferences.privacy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};