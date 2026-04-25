import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getPortfolioDB } from '../../config/db.js';

const apiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  keyHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: null },
  requestCount: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },

    password: { type: String, minlength: 6, default: null },

    email: { type: String, sparse: true, lowercase: true, trim: true },

    birthYear: { type: Number },

    // OTP for password reset
    otpHash:   { type: String, default: null },
    otpExpiry: { type: Date,   default: null },

    profileImage: { type: String, default: null },

    // ── Google OAuth fields ───────────────────────────────────────────────────
    googleId: { type: String, sparse: true, unique: true },
    googleEmail: { type: String, sparse: true },
    googleAvatar: { type: String, default: null },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },

    // API Keys
    apiKeys: [apiKeySchema],

    // Role
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Custom subdomain (portdomain)
    portdomain: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    },

    // Template preferences
    selectedTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      default: null,
    },

    // Preferences nested object
    preferences: {
      notifications: {
        loginAlerts:    { type: Boolean, default: true },
        weeklyDigest:   { type: Boolean, default: false },
        productUpdates: { type: Boolean, default: true },
        securityAlerts: { type: Boolean, default: true },
      },
      appearance: {
        theme:    { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
        language: { type: String, enum: ['en', 'ta', 'hi'], default: 'en' },
        timezone: { type: String, default: 'UTC' },
      },
      privacy: {
        activityLog:      { type: Boolean, default: true },
        analyticsSharing: { type: Boolean, default: false },
        publicProfile:    { type: Boolean, default: true },
      },
    },

    // Two-Factor Authentication (TOTP)
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, default: null }, // Encrypted base32 secret
      backupCodes: [{ type: String }], // Encrypted backup codes
      disableToken: {
        hash: { type: String, default: null }, // Hash of disable token
        expiresAt: { type: Date, default: null }, // Token expiration time
      },
    },

    // Deletion Warning Tracking
    deletionWarning: {
      emailSentAt: { type: Date, default: null }, // When warning email was sent
      deletionScheduledFor: { type: Date, default: null }, // Scheduled deletion date (7 days from email)
      becameActiveAfter: { type: Boolean, default: false }, // Did user become active after warning
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password exists and has been modified
  if (!this.isModified('password') || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// ── Auto-generate portdomain from username if not provided ────────────────────
userSchema.pre('save', async function (next) {
  if (this.portdomain) return next();

  let base = this.username
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!base) base = 'user';

  let candidate = base;
  let suffix = 1;

  while (await this.constructor.findOne({ portdomain: candidate })) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }

  this.portdomain = candidate;
  next();
});

// ── Instance method: compare passwords ───────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
}; 

export default getPortfolioDB().model('User', userSchema);