import express from 'express';
import { getPublicPortfolio, getSignedUrl } from '../controllers/publicController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();

// Public portfolio by username (rate limited)
router.get('/port/:username', publicRateLimit, getPublicPortfolio);

// Public signed URL helper (rate limited)
router.get('/util/signed-url', publicRateLimit, getSignedUrl);

export default router;
