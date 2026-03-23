import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const educationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: Number,
  institution: String,
  course: String,
  duration: String,
  cgpa: String,
  percentage: String,
}, { timestamps: true });

export default getPortfolioDB().model('Education', educationSchema);
