import { Router } from 'express';
import { listNotifications, getNotification, createNotification, updateNotification, deleteNotification } from '../controllers/notifications.controller.js';

const router = Router();
router.get('/', listNotifications);
router.get('/:id', getNotification);
router.post('/', createNotification);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);
export default router;
