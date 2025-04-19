import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import { commentValidation, commentUpdateValidation } from '../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Comment routes
router.post('/', commentValidation, addComment);
router.route('/:id')
  .put(commentUpdateValidation, updateComment)
  .delete(deleteComment);

export default router;
