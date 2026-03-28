import bcrypt from 'bcryptjs';
import Item from '../../models/vault/Item.js';
import { generateSignedUrl } from './uploadController.js';

export const getItems = async (req, res) => {
  try {
    let items = await Item.find({ user: req.user._id, deleted: false }).sort('-createdAt');
    items = await Promise.all(items.map(async (item) => {
      item = item.toObject();
      if (item.type === 'file' && item.metadata?.s3Key) {
        try {
          item.metadata.signedUrl = await generateSignedUrl(item.metadata.s3Key, 3600);
        } catch (err) {
          console.warn('Could not generate signed URL for file:', err.message);
        }
      }
      return item;
    }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id, deleted: false });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { type, title, content, metadata, hasPassword, password } = req.body;
    const passwordHash = hasPassword && password ? await bcrypt.hash(password, 10) : '';
    res.status(201).json(await Item.create({ user: req.user._id, type, title, content, metadata, hasPassword: !!hasPassword, passwordHash }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const { title, content, metadata, hasPassword, password } = req.body;
    if (title !== undefined) item.title = title;
    if (content !== undefined) item.content = content;
    if (metadata !== undefined) item.metadata = metadata;
    if (hasPassword !== undefined) item.hasPassword = hasPassword;
    if (password) item.passwordHash = await bcrypt.hash(password, 10);
    res.json(await item.save());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.deleted = true;
    await item.save();
    res.json({ message: 'Item moved to trash' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (!item.hasPassword || !item.passwordHash) {
      return res.json({ item: item.toObject() });
    }
    const isMatch = await bcrypt.compare(password, item.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    res.json({ item: item.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrash = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id, deleted: true }).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id, deleted: true });
    if (!item) return res.status(404).json({ message: 'Item not found in trash' });
    item.deleted = false;
    await item.save();
    res.json({ message: 'Item restored', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const permanentDelete = async (req, res) => {
  try {
    const result = await Item.deleteOne({ _id: req.params.id, user: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const emptyTrash = async (req, res) => {
  try {
    const result = await Item.deleteMany({ user: req.user._id, deleted: true });
    res.json({ message: `Deleted ${result.deletedCount} items from trash` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};