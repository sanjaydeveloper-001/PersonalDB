import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const certificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: Number,
  name: String,
  issuer: String,
  image: String,
  link: String,
}, { timestamps: true });

export default getPortfolioDB().model('Certification', certificationSchema);
