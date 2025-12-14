import { Notification, User } from '../models/index.js';

export const notifyUser = async (userId, type, message) => {
  if (!userId) return null;
  try {
    return await Notification.create({ idUsers: userId, type, message });
  } catch (_) { return null }
};

export const notifyUsers = async (userIds, type, message) => {
  try {
    const docs = (userIds || []).filter(Boolean).map(id => ({ idUsers: id, type, message }));
    if (!docs.length) return [];
    return await Notification.insertMany(docs, { ordered: false });
  } catch (_) { return [] }
};

export const notifyByRole = async (role, type, message) => {
  try {
    const users = await User.find({ role }, { _id: 1 }).lean();
    const ids = users.map(u => u._id);
    return await notifyUsers(ids, type, message);
  } catch (_) { return [] }
};

export const notifyAdmins = async (type, message) => notifyByRole('admin', type, message);

// Notify all freelancers, regardless of role label variation present in DB
export const notifyAllFreelancers = async (type, message) => {
  try {
    const users = await User.find({
      $or: [
        { role: { $in: ['freelancer', 'freelance', 'freelanceur'] } },
        { role: { $nin: ['client', 'admin'] } }
      ]
    }, { _id: 1 }).lean();
    const ids = users.map(u => u._id);
    return await notifyUsers(ids, type, message);
  } catch (_) { return [] }
};
