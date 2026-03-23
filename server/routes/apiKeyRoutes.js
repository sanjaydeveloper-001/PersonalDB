import express from 'express';
import { getApiKeys, generateApiKey_endpoint, revokeApiKey, getApiUsage } from '../controllers/apiKeyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getApiKeys);
router.post('/', generateApiKey_endpoint);
router.delete('/:id', revokeApiKey);
router.get('/usage/stats', getApiUsage);

export default router;
