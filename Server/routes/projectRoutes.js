import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { getProjectTasks } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';
import { projectValidation, projectUpdateValidation } from '../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Project routes
router.route('/')
  .get(getProjects)
  .post(authorize('admin'), projectValidation, createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('admin'), projectUpdateValidation, updateProject)
  .delete(authorize('admin'), deleteProject);

// Get tasks for a specific project
router.get('/:projectId/tasks', getProjectTasks);

export default router;
