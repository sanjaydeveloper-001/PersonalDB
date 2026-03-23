import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: String,
  age: Number,
  domain: String,
  summary: String,
  location: String,
  phone: String,
  email: String,
  cvLink: String,
  profilePhoto: String,
  contact: [{ id: Number, name: String, link: String, icon: String }],
  social: [{ id: Number, name: String, link: String, icon: String, color: String }],
}, { timestamps: true });

export default getPortfolioDB().model('Profile', profileSchema);
