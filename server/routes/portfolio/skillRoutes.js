import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getSkills, updateSkills } from '../../controllers/portfolio/skillController.js';

const router = express.Router();
router.route('/').get(protect, getSkills).put(protect, updateSkills);
export default router;
