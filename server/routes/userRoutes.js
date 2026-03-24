import express from 'express';
import { searchUsers } from '../controllers/userController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();

router.get('/search', publicRateLimit, searchUsers);

export default router;