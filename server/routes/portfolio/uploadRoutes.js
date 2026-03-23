import express from 'express';
import { protect } from '../../middleware/auth.js';
import { uploadPortfolio } from '../../middleware/uploadPortfolio.js';
import { uploadImage } from '../../controllers/portfolio/uploadController.js';

const router = express.Router();
router.post('/', protect, (req, res, next) => {
  uploadPortfolio.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    uploadImage(req, res);
  });
});
export default router;
