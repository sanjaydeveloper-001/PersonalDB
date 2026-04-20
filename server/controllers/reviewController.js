import mongoose from 'mongoose';
import Review from '../models/common/Review.js';
import User from '../models/common/User.js';
import Experience from '../models/portfolio/Experience.js';
import { sendReviewApprovedEmailAsync, sendReviewRejectedEmailAsync } from '../services/email/emailService.js';

// Create a new review for the website
export const createReview = async (req, res) => {
  try {
    const { stars, message } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!stars || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: stars, message',
      });
    }

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review message must be at least 10 characters',
      });
    }

    // Check if user already reviewed the website
    const existingReview = await Review.findOne({ userId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review. Please wait for it to be approved or contact support.',
      });
    }

    // Get reviewer details
    const reviewer = await User.findById(userId).select('username profileImage googleAvatar');
    if (!reviewer) {
      return res.status(404).json({
        success: false,
        message: 'Reviewer not found',
      });
    }

    const profileImage = reviewer.profileImage || reviewer.googleAvatar || null;

    // Create review
    const review = new Review({
      userId,
      stars,
      message,
      profileImage,
      reviewerName: reviewer.username,
      status: 'pending',
      isPublished: false,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Awaiting approval.',
      data: review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

// Get all published reviews for the website
export const getAllPublishedReviews = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      isPublished: true,
      status: 'approved',
    })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'username profileImage googleAvatar');

    const total = await Review.countDocuments({
      isPublished: true,
      status: 'approved',
    });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

// Get current user's review
export const getUserReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const review = await Review.findOne({ userId }).select('stars message status isPublished date');

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user review',
      error: error.message,
    });
  }
};

// Get all pending reviews (admin only)
export const getPendingReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view pending reviews',
      });
    }

    const reviews = await Review.find({ status: 'pending' })
      .sort({ date: -1 })
      .populate('userId', 'username email profileImage');

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending reviews',
      error: error.message,
    });
  }
};

// Get website review stats
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { isPublished: true, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$stars' },
          totalReviews: { $sum: 1 },
          ratingDistribution: { $push: '$stars' },
        },
      },
    ]);

    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (stats.length > 0) {
      stats[0].ratingDistribution.forEach((rating) => {
        ratingBreakdown[rating]++;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        averageRating: stats.length > 0 ? stats[0].averageRating.toFixed(1) : 0,
        totalReviews: stats.length > 0 ? stats[0].totalReviews : 0,
        ratingBreakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message,
    });
  }
};

// Approve a review (admin only)
export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { publish = true } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve reviews',
      });
    }

    const review = await Review.findById(reviewId).populate('userId', 'username email');
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review.status = 'approved';
    review.isPublished = publish;
    await review.save();

    // Send approval email to user
    if (review.userId && review.userId.email) {
      sendReviewApprovedEmailAsync(review.userId.email, review.userId.username);
    }

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review',
      error: error.message,
    });
  }
};

// Reject a review (admin only)
export const rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can reject reviews',
      });
    }

    const review = await Review.findById(reviewId).populate('userId', 'username email');
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review.status = 'rejected';
    review.isPublished = false;
    await review.save();

    // Send rejection email to user
    if (review.userId && review.userId.email) {
      sendReviewRejectedEmailAsync(review.userId.email, review.userId.username);
    }

    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject review',
      error: error.message,
    });
  }
};

// Delete a review (admin only)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete reviews',
      });
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all reviews',
      });
    }

    const reviews = await Review.find()
      .sort({ date: -1 })
      .populate('userId', 'username profileImage');

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};
