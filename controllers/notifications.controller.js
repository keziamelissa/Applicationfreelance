import { Notification } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listNotifications = list(Notification);
export const getNotification = getOne(Notification);
export const createNotification = createOne(Notification);
export const updateNotification = updateOne(Notification);
export const deleteNotification = deleteOne(Notification);
