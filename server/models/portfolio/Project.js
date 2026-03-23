import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: Number,
  title: String,
  tech: [String],
  description: String,
  image: String,
  demo: String,
  repo: String,
}, { timestamps: true });

export default getPortfolioDB().model('Project', projectSchema);
