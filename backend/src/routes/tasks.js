import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';

const router = express.Router();

// Statistics route (before /:id to avoid conflict)
router.get('/stats', getTaskStats);

// Main CRUD routes
router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

export default router;
