import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem, verifyPassword, getTrash, restoreItem, permanentDelete, emptyTrash } from '../../controllers/vault/itemController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();
// Define specific routes BEFORE :id routes to prevent conflicts
router.get('/trash', protect, getTrash);
router.delete('/trash/empty', protect, emptyTrash);
router.post('/:id/verify', protect, verifyPassword);
router.put('/:id/restore', protect, restoreItem);
router.delete('/:id/permanent', protect, permanentDelete);
// Main CRUD routes
router.route('/').get(protect, getItems).post(protect, createItem);
router.route('/:id').get(protect, getItemById).put(protect, updateItem).delete(protect, deleteItem);
export default router;
