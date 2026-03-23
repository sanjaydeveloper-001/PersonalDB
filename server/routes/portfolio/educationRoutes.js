import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getEducations, createEducation, updateEducation, deleteEducation } from '../../controllers/portfolio/educationController.js';

const router = express.Router();
router.route('/').get(protect, getEducations).post(protect, createEducation);
router.route('/:id').put(protect, updateEducation).delete(protect, deleteEducation);
export default router;
