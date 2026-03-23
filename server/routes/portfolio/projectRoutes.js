import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getProjects, createProject, updateProject, deleteProject } from '../../controllers/portfolio/projectController.js';

const router = express.Router();
router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject);
export default router;
