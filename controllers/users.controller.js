import User from '../models/user.js';
import { Candidature, Contrat, Tache, Evaluation } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listUsers = list(User);
export const getUser = getOne(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

// Dashboard metrics for a user by role
export const getUserDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('role');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'client') {
      // Candidatures reçues: toutes les candidatures liées aux tâches du client
      const taches = await Tache.find({ idClient: id }).select('_id');
      const tacheIds = taches.map((t) => t._id);

      const candidatures = tacheIds.length
        ? await Candidature.countDocuments({ idTache: { $in: tacheIds } })
        : 0;

      const enCours = await Contrat.countDocuments({ idClient: id, satuts: 'enCours' });
      const termines = await Contrat.countDocuments({ idClient: id, satuts: 'termine' });

      return res.json({
        role: user.role,
        candidatures,
        enCours,
        termines,
        noteMoyenne: null,
      });
    }

    if (user.role === 'freelancer') {
      // Candidatures envoyées
      const candidatures = await Candidature.countDocuments({ idFreelanceur: id });

      const enCours = await Contrat.countDocuments({ idFreelanceur: id, satuts: 'enCours' });
      const termines = await Contrat.countDocuments({ idFreelanceur: id, satuts: 'termine' });

      // Note moyenne = somme des ratings des évaluations liées aux contrats terminés / nb d'évaluations
      let noteMoyenne = 0;
      if (termines > 0) {
        const contratsTermines = await Contrat.find({ idFreelanceur: id, satuts: 'termine' }).select('_id');
        const contratIds = contratsTermines.map((c) => c._id);

        if (contratIds.length) {
          const agg = await Evaluation.aggregate([
            { $match: { freelancerId: user._id, contratId: { $in: contratIds } } },
            { $group: { _id: null, sum: { $sum: '$rating' }, count: { $sum: 1 } } },
          ]);
          const sumRatings = agg.length ? agg[0].sum : 0;
          const evalCount = agg.length ? agg[0].count : 0;
          noteMoyenne = evalCount > 0 ? sumRatings / evalCount : 0;
        }
      }

      return res.json({
        role: user.role,
        candidatures,
        enCours,
        termines,
        noteMoyenne: Number(noteMoyenne.toFixed(2)),
      });
    }

    // For other roles (e.g., admin), return zeros by default
    return res.json({ role: user.role, candidatures: 0, enCours: 0, termines: 0, noteMoyenne: null });
  } catch (err) {
    next(err);
  }
};
