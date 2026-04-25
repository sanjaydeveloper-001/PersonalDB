import express from 'express';
import {
  getUnusedUsers,
  sendDeletionWarningEmail,
  checkUserActivity,
  getReadyForDeletion,
} from '../controllers/unusedUsersController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(protect);
router.use(adminOnly);

// Get ready for deletion FIRST (more specific route)
router.get('/unused-users/ready-for-deletion', getReadyForDeletion);

// Get all unused users (split into warning-not-sent and warning-not-activated)
router.get('/unused-users', getUnusedUsers);

// Send deletion warning email to a specific user
router.post('/unused-users/:userId/send-warning', sendDeletionWarningEmail);

// Check which warned users became active
router.post('/unused-users/check-activity', checkUserActivity);

export default router;
