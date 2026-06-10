import { Router } from 'express';
import { getSettingsController, putSettingsController } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettingsController);
router.put('/', putSettingsController);

export default router;
