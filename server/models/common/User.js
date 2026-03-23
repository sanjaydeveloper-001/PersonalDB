import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getVaultDB } from '../../config/db.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  birthYear: { type: Number, default: null, min: 1900, max: new Date().getFullYear() - 16 },
  placeAnswerHash: { type: String, default: '' },
  friendAnswerHash: { type: String, default: '' },
  apiKeys: [{
    name: { type: String, required: true },
    key: { type: String, required: true },
    keyHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date, default: null },
    requestCount: { type: Number, default: 0 },
  }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default getVaultDB().model('User', userSchema);
