import { Router } from 'express';
import {
  getNotifications,
  patchAllNotificationsRead,
  patchNotificationRead
} from '../controllers/notificationController.js';

const router = Router();

router.get('/', getNotifications);
router.patch('/read-all', patchAllNotificationsRead);
router.patch('/:id/read', patchNotificationRead);

export default router;
