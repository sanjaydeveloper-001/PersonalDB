import mongoose from 'mongoose';
import { getPortfolioDB } from '../config/db.js';

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a template name'],
    unique: true,
    trim: true,
  },
  image: {
    type: String, // URL to template preview image
    required: [true, 'Please provide a template image'],
  },
  code: {
    type: String, // The actual HTML/CSS/JS template code
    required: [true, 'Please provide template code'],
  },
  usercount: {
    type: Number,
    default: 0,
  },
  likescount: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default getPortfolioDB().model('Template', TemplateSchema); 