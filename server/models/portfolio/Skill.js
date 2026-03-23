import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const skillCategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true }, 
    items:    [{ type: String, trim: true }], 
  },
  { _id: true }
);

const skillSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [skillCategorySchema],
  },
  { timestamps: true }
);

export default getPortfolioDB().model('Skill', skillSchema);