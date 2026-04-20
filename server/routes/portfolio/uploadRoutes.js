import express from 'express';
import { protect } from '../../middleware/auth.js';
import { uploadPortfolio } from '../../middleware/uploadPortfolio.js';
import { uploadResume } from '../../middleware/uploadResume.js';
import { uploadImage, uploadResume as uploadResumeController, deleteResume } from '../../controllers/portfolio/uploadController.js';

const router = express.Router();

// Image upload
router.post('/', protect, (req, res, next) => {
  uploadPortfolio.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    uploadImage(req, res);
  });
});

// Resume upload
router.post('/resume', protect, (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    uploadResumeController(req, res);
  });
});

// Resume delete
router.delete('/resume', protect, deleteResume);

export default router;
