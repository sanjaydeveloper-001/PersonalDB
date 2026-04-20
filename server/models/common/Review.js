import mongoose from 'mongoose';
import { getPortfolioDB } from '../../config/db.js';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    profileImage: {
      type: String,
      default: null,
    },
    reviewerName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for better query performance
reviewSchema.index({ isPublished: 1, status: 1 });
reviewSchema.index({ userId: 1 });

export default getPortfolioDB().model('Review', reviewSchema);
