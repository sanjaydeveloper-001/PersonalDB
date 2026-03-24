import express from 'express';
import rateLimit from 'express-rate-limit';
import { searchUsers } from '../controllers/userController.js';

const searchRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

const router = express.Router();

// GET /api/users/search?q=username
router.get('/search', searchRateLimit, searchUsers);

export default router;
