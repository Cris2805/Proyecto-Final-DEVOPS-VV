import { Router } from 'express';
import {
  getTask,
  getTasks,
  patchTaskStatus,
  postTask,
  putTask,
  removeTask
} from '../controllers/taskController.js';
import {
  getSubtasks,
  postSubtask
} from '../controllers/subtaskController.js';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);
router.get('/:id/subtasks', getSubtasks);
router.post('/', postTask);
router.post('/:id/subtasks', postSubtask);
router.put('/:id', putTask);
router.patch('/:id/status', patchTaskStatus);
router.delete('/:id', removeTask);

export default router;
