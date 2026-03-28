import jwt from 'jsonwebtoken';
import User from '../models/common/User.js';

// 🔥 helper to always attach CORS headers
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;

  if (origin === process.env.CLIENT_URL1 || origin === process.env.CLIENT_URL2) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
};

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ❌ No token
  if (!token) {
    setCorsHeaders(req, res);
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    // ❌ No user
    if (!user) {
      setCorsHeaders(req, res);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();

  } catch (error) {
    setCorsHeaders(req, res);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};