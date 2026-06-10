import { Router } from 'express';
import {
  getProject,
  getProjects,
  postProject,
  putProject,
  removeProject
} from '../controllers/projectController.js';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', postProject);
router.put('/:id', putProject);
router.delete('/:id', removeProject);

export default router;
