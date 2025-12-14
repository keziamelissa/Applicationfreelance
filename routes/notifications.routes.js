import { Router } from 'express';
import { listNotifications, getNotification, createNotification, updateNotification, deleteNotification, listMyNotifications, markAllRead } from '../controllers/notifications.controller.js';
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listNotifications);
router.get('/:id', getNotification);
router.post('/', createNotification);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);
// Current user's notifications
router.get('/mine/list', protect, listMyNotifications);
router.post('/mine/mark-all-read', protect, markAllRead);
export default router;
