import express from 'express';
import { getPublicPortfolioByDomain, getSignedUrl } from '../controllers/publicController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();

// Single route — backend tries portdomain first, falls back to username
router.get('/port/:portdomain', publicRateLimit, getPublicPortfolioByDomain);
router.get('/util/signed-url', publicRateLimit, getSignedUrl);

export default router;