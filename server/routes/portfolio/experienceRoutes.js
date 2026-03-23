import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../controllers/portfolio/experienceController.js';

const router = express.Router();
router.route('/').get(protect, getExperiences).post(protect, createExperience);
router.route('/:id').put(protect, updateExperience).delete(protect, deleteExperience);
export default router;
