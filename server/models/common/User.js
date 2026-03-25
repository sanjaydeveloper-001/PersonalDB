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
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, sparse: true },
    birthYear: { type: Number },
    placeAnswerHash: { type: String },
    friendAnswerHash: { type: String },
    
    // API Keys
    apiKeys: [apiKeySchema],

    //Role
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
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
        loginAlerts: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
        productUpdates: { type: Boolean, default: true },
        securityAlerts: { type: Boolean, default: true },
      },
      appearance: {
        theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
        language: { type: String, enum: ['en', 'ta', 'hi'], default: 'en' },
        timezone: { type: String, default: 'UTC' },
      },
      privacy: {
        activityLog: { type: Boolean, default: true },
        analyticsSharing: { type: Boolean, default: false },
        publicProfile: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default getPortfolioDB().model('User', userSchema);