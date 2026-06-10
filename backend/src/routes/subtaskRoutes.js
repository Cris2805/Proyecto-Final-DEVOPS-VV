import { Router } from 'express';
import { patchSubtaskToggle, removeSubtask } from '../controllers/subtaskController.js';

const router = Router();

router.patch('/:id/toggle', patchSubtaskToggle);
router.delete('/:id', removeSubtask);

export default router;
