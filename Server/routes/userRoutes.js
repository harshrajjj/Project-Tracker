import express from 'express';
import { getUsers, getUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);

export default router;
