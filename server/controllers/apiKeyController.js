import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/common/User.js';

const generateApiKey = () => {
  const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
  return key;
};

const hashApiKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

export const getApiKeys = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Return keys without exposing the full key or hash
    const keys = (user.apiKeys || []).map(key => ({
      _id: key._id,
      name: key.name,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      requestCount: key.requestCount,
      partialKey: `...${key.key.slice(-4)}`,
    }));

    res.json(keys);
  } catch (error) {
    console.error('Get API Keys Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateApiKey_endpoint = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Key name is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Limit to 10 API keys per user
    if (user.apiKeys && user.apiKeys.length >= 10) {
      return res.status(403).json({ message: 'Maximum 10 API keys allowed' });
    }

    const newKey = generateApiKey();
    const keyHash = hashApiKey(newKey);

    if (!user.apiKeys) {
      user.apiKeys = [];
    }

    user.apiKeys.push({
      name: name.trim(),
      key: newKey,
      keyHash: keyHash,
      createdAt: new Date(),
      lastUsed: null,
      requestCount: 0,
    });

    await user.save();

    // Return the full key only once
    res.status(201).json({
      _id: user.apiKeys[user.apiKeys.length - 1]._id,
      name: name.trim(),
      key: newKey,
      createdAt: new Date(),
      message: 'Please save this key securely. It will not be shown again.',
    });
  } catch (error) {
    console.error('Generate API Key Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.apiKeys || user.apiKeys.length === 0) {
      return res.status(404).json({ message: 'No API keys found' });
    }

    const keyIndex = user.apiKeys.findIndex(k => k._id.toString() === id);
    if (keyIndex === -1) {
      return res.status(404).json({ message: 'API key not found' });
    }

    user.apiKeys.splice(keyIndex, 1);
    await user.save();

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API Key Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getApiUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalRequests = (user.apiKeys || []).reduce((sum, key) => sum + key.requestCount, 0);

    const requestsByKey = (user.apiKeys || []).map(key => ({
      _id: key._id,
      name: key.name,
      requestCount: key.requestCount,
      lastUsed: key.lastUsed,
    }));

    // Storage used - placeholder (could integrate with S3 later)
    const storageUsed = 150; // MB (example)
    const storageLimit = 1024; // 1 GB in MB

    res.json({
      totalRequests,
      requestsByKey,
      storageUsed,
      storageLimit,
      requestsThisMonth: totalRequests, // Could track monthly separately
      activeKeys: user.apiKeys.filter(k => k.lastUsed).length,
      totalKeys: user.apiKeys.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyApiKey = async (keyString) => {
  try {
    const keyHash = hashApiKey(keyString);
    const user = await User.findOne({ 'apiKeys.keyHash': keyHash });
    
    if (!user) return null;

    const key = user.apiKeys.find(k => k.keyHash === keyHash);
    if (!key) return null;

    // Update last used and increment request count
    key.lastUsed = new Date();
    key.requestCount = (key.requestCount || 0) + 1;
    await user.save();

    return user._id;
  } catch (error) {
    console.error('Error verifying API key:', error);
    return null;
  }
};
