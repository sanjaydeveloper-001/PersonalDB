import express from 'express';
import { 
  getAuthenticatedPortfolio, 
  getPortfolioSection 
} from '../controllers/apiPortfolioController.js';
import { protectEither } from '../middleware/protectEither.js';

const router = express.Router();

// Get full portfolio (works with JWT cookie or API key)
router.get('/', protectEither, getAuthenticatedPortfolio);

// Get specific section (works with JWT cookie or API key)
router.get('/:section', protectEither, getPortfolioSection);

export default router;