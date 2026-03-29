import express from 'express';
import { getPublicPortfolio, getPublicPortfolioByDomain, getSignedUrl } from '../controllers/publicController.js';
import { publicRateLimit } from '../middleware/publicRateLimit.js';

const router = express.Router();

// Public portfolio by username (rate limited)
router.get('/port/:username', publicRateLimit, getPublicPortfolio);
router.get('/port/domain/:portdomain', publicRateLimit, getPublicPortfolioByDomain);  // lookup by portdomain for subdomain mode
router.get('/util/signed-url', publicRateLimit, getSignedUrl);

export default router;
