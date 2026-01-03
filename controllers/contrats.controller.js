import { Contrat, Candidature } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listContrats = list(Contrat);
export const getContrat = getOne(Contrat);
export const createContrat = async (req, res, next) => {
  try {
    const contrat = await Contrat.create(req.body);
    const { idTache, idFreelanceur } = req.body || {};
    if (idTache && idFreelanceur) {
      try {
        await Candidature.findOneAndUpdate(
          { idTache, idFreelanceur, status: 'enAttente' },
          { status: 'accepte' },
          { new: true }
        );
      } catch (_) {}
    }
    res.status(201).json(contrat);
  } catch (e) { next(e); }
};
export const updateContrat = updateOne(Contrat);
export const deleteContrat = deleteOne(Contrat);

// List contracts for the authenticated user (either client or freelancer)
export const listMyContrats = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    if (!uid) return res.status(401).json({ message: 'Non authentifié' });
    const rows = await Contrat.find({ $or: [{ idClient: uid }, { idFreelanceur: uid }] }).sort({ dateDeCreation: -1 });
    res.json(rows);
  } catch (e) { next(e); }
};
