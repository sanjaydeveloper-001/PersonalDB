import express from 'express';
import { protectEither } from '../../middleware/protectEither.js';
import { getProfile, updateProfile } from '../../controllers/portfolio/profileController.js';

const router = express.Router();
router.route('/').get(protectEither, getProfile).put(protectEither, updateProfile);
export default router;