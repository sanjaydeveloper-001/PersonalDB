import express from 'express';
import {
  createReview,
  approveReview,
  rejectReview,
  getReviewStats,
  deleteReview,
  getAllReviews,
  getAllPublishedReviews,
  getUserReview,
  getPendingReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// Public routes
router.get('/all', getAllPublishedReviews); // Get all published reviews for website (homepage)
router.get('/stats', getReviewStats); // Get website review statistics

// Protected routes
router.post('/', protect, createReview); // Create a new review for website
router.get('/my-review', protect, getUserReview); // Get current user's review status

router.patch('/:reviewId/approve', protect, adminOnly, approveReview); // Approve a review
router.patch('/:reviewId/reject', protect, adminOnly, rejectReview); // Reject a review

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllReviews); // Get all reviews
router.get('/admin/pending', protect, adminOnly, getPendingReviews); // Get pending reviews
router.delete('/:reviewId', protect, adminOnly, deleteReview); // Delete a review

export default router;
