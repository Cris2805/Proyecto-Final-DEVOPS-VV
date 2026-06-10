import { Router } from 'express';
import { getUser, getUsers, postUser, putUser, removeUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', removeUser);

export default router;
