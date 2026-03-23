import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getInterests, updateInterests } from '../../controllers/portfolio/interestController.js';

const router = express.Router();
router.route('/').get(protect, getInterests).put(protect, updateInterests);
export default router;
