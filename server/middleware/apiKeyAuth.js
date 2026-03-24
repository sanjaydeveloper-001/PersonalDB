import { verifyApiKey } from '../controllers/apiKeyController.js';

export const protectApiKey = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no API key provided' });
  }

  try {
    // Verify the API key and get the user ID
    const userId = await verifyApiKey(token);
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Attach user ID to request
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'API key verification failed' });
  }
};