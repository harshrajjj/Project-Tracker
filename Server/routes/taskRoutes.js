import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { getTaskComments } from '../controllers/commentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { taskValidation, taskUpdateValidation } from '../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(authorize('admin'), taskValidation, createTask);

router.route('/:id')
  .get(getTask)
  .put(taskUpdateValidation, updateTask)
  .delete(authorize('admin'), deleteTask);

// Get comments for a specific task
router.get('/:taskId/comments', getTaskComments);

export default router;
