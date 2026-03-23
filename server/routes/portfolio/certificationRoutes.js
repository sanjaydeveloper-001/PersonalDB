import express from 'express';
import { protect } from '../../middleware/auth.js';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../../controllers/portfolio/certificationController.js';

const router = express.Router();
router.route('/').get(protect, getCertifications).post(protect, createCertification);
router.route('/:id').put(protect, updateCertification).delete(protect, deleteCertification);
export default router;
