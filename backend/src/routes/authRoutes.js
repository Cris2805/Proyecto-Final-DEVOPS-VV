import { Router } from 'express';
import { listUsers, login } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/users', listUsers);

export default router;
