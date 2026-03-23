import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const interestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  interests: [String],
}, { timestamps: true });

export default getPortfolioDB().model('Interest', interestSchema);
