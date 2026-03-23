import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: Number,
  company: String,
  role: String,
  duration: String,
  description: String,
  type: String,
}, { timestamps: true });

export default getPortfolioDB().model('Experience', experienceSchema);
