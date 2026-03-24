import jwt from 'jsonwebtoken';
import User from '../models/common/User.js';
import { verifyApiKey } from '../controllers/apiKeyController.js';

export const protectEither = async (req, res, next) => {
  let token;
  let isApiKey = false;

  // Try JWT cookie first
  if (req.cookies?.token) {
    token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      // JWT failed, try API key
    }
  }

  // Try API key from Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    isApiKey = true;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, provide JWT cookie or API key' });
  }

  try {
    if (isApiKey) {
      // Verify API key
      const userId = await verifyApiKey(token);
      if (!userId) {
        return res.status(401).json({ message: 'Invalid API key' });
      }
      const user = await User.findById(userId).select('-password');
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};