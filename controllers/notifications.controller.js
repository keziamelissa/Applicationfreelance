import { Notification } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

// Default list (admin) or mine when query ?mine=1
export const listNotifications = async (req, res, next) => {
  try {
    if (req.query?.mine) {
      const uid = req.user?.id || req.user?._id;
      if (!uid) return res.status(401).json({ message: 'Non authentifié' });
      const rows = await Notification.find({ idUsers: uid }).sort({ dateDeCreation: -1 });
      return res.json(rows);
    }
    const rows = await Notification.find().sort({ dateDeCreation: -1 });
    return res.json(rows);
  } catch (e) { next(e); }
};
export const getNotification = getOne(Notification);
export const createNotification = createOne(Notification);
export const updateNotification = updateOne(Notification);
export const deleteNotification = deleteOne(Notification);

// Convenience: list mine
export const listMyNotifications = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    if (!uid) return res.status(401).json({ message: 'Non authentifié' });
    const rows = await Notification.find({ idUsers: uid }).sort({ dateDeCreation: -1 });
    res.json(rows);
  } catch (e) { next(e); }
};

// Mark all as read for current user
export const markAllRead = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    if (!uid) return res.status(401).json({ message: 'Non authentifié' });
    await Notification.updateMany({ idUsers: uid, satuts: { $ne: true } }, { $set: { satuts: true } });
    res.json({ message: 'Notifications marquées comme lues' });
  } catch (e) { next(e); }
};
