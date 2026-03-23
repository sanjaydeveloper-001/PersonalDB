import mongoose from 'mongoose';
import { getVaultDB } from '../../config/db.js';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: Number, min: 1, max: 3, required: true },
  publicToken: { type: String, required: true, unique: true },
  file: {
    key: String,
    contentType: String,
    originalName: String,
    size: Number,
  },
}, { timestamps: true });

resumeSchema.index({ user: 1, position: 1 }, { unique: true });

export default getVaultDB().model('Resume', resumeSchema);
