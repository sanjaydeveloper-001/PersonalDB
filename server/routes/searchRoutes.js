import express from 'express';
import { searchPublicUsers } from '../controllers/searchController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();
router.get('/users', publicRateLimit, searchPublicUsers);

export default router;