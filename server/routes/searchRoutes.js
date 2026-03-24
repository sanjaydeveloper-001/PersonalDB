import express from 'express';
import { searchPublicUsers } from '../controllers/searchController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();

// Search public profiles by username (rate limited)
// Only returns users with publicProfile: true
router.get('/users', publicRateLimit, searchPublicUsers);

export default router;