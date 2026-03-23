import express from 'express';

// Simple in-memory rate limiter: 30 requests per minute per IP
const requestCounts = new Map();

export const publicRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  let timestamps = requestCounts.get(ip);
  timestamps = timestamps.filter(ts => ts > oneMinuteAgo);
  requestCounts.set(ip, timestamps);

  if (timestamps.length >= 30) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  timestamps.push(now);
  next();
};

// Cleanup old IPs every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  for (const [ip, timestamps] of requestCounts.entries()) {
    const validTimestamps = timestamps.filter(ts => ts > fiveMinutesAgo);
    if (validTimestamps.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, validTimestamps);
    }
  }
}, 5 * 60 * 1000);

export default publicRateLimit;
