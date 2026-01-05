import { Revision, Soumission, Tache } from '../models/index.js';
import { notifyUser, notifyAdmins } from '../services/notifications.service.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listRevisions = list(Revision);
export const getRevisions = getOne(Revision);
export const updateRevisions = updateOne(Revision);
export const deleteRevisions = deleteOne(Revision);

// Create a revision request by client and notify the freelancer
export const createRevisions = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const row = await Revision.create(payload);

    // Try to notify the target freelancer
    try {
      let freelancerId = row.freelancerId;
      let taskTitle = '';
      if ((!freelancerId || !row.clientId) && row.soumissionId) {
        const s = await Soumission.findById(row.soumissionId).lean();
        if (s) {
          freelancerId = freelancerId || s.freelancerId;
          if (s.taskId) {
            const t = await Tache.findById(s.taskId).lean();
            taskTitle = t ? (t.titre || t.title || '') : '';
          }
        }
      }
      if (freelancerId) {
        await notifyUser(freelancerId, 'revision.requested', `Une révision a été demandée${taskTitle ? ` pour la tâche "${taskTitle}"` : ''}.`);
      } else {
        await notifyAdmins('revision.requested', 'Une révision a été demandée, mais aucun freelance cible n’a été trouvé.');
      }
    } catch (_) { /* ignore notification errors */ }

    res.status(201).json(row);
  } catch (e) { next(e); }
};
