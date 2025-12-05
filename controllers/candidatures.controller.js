import { Candidature, Tache, Contrat } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listCandidatures = list(Candidature);
export const getCandidature = getOne(Candidature);
export const createCandidature = createOne(Candidature);
export const updateCandidature = updateOne(Candidature);
export const deleteCandidature = deleteOne(Candidature);

// List all candidatures for a given task (tache)
export const listCandidaturesByTache = async (req, res, next) => {
  try {
    const { tacheId } = req.params;
    const rows = await Candidature
      .find({ idTache: tacheId })
      .populate('idFreelanceur', 'nom prenom profile_photo');
    res.json(rows);
  } catch (e) { next(e); }
};

// Accept a candidature as the authenticated client: assign freelancer to task and create a contract
export const acceptCandidature = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    const { id } = req.params; // candidature id
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });

    const cand = await Candidature.findById(id);
    if (!cand) return res.status(404).json({ error: 'Candidature non trouvée' });

    const tache = await Tache.findById(cand.idTache);
    if (!tache) return res.status(404).json({ error: 'Tâche non trouvée' });
    if (String(tache.idClient) !== String(clientId)) return res.status(403).json({ error: 'Accès refusé' });

    // Update candidature status
    cand.status = 'accepte';
    await cand.save();

    // Assign freelancer to task and move status to enCours
    tache.freelanceId = cand.idFreelanceur;
    tache.status = 'enCours';
    await tache.save();

    // Create contract
    const contrat = await Contrat.create({
      idTache: tache._id,
      idClient: tache.idClient,
      idFreelanceur: cand.idFreelanceur,
      type: tache.type,
      montantConvenu: cand.budgetProposer ?? tache.budget,
      satuts: 'enCours',
      dateDeDebut: new Date(),
    });

    res.status(200).json({ message: 'Candidature acceptée et contrat créé', contrat });
  } catch (e) { next(e); }
};

// Reject a candidature as client
export const rejectCandidature = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    const { id } = req.params; // candidature id
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });

    const cand = await Candidature.findById(id);
    if (!cand) return res.status(404).json({ error: 'Candidature non trouvée' });
    const tache = await Tache.findById(cand.idTache);
    if (!tache) return res.status(404).json({ error: 'Tâche non trouvée' });
    if (String(tache.idClient) !== String(clientId)) return res.status(403).json({ error: 'Accès refusé' });

    cand.status = 'rejete';
    await cand.save();
    res.status(200).json({ message: 'Candidature refusée' });
  } catch (e) { next(e); }
};

// Apply to a task as the authenticated freelancer
export const applyToTache = async (req, res, next) => {
  try {
    const { tacheId } = req.params;
    const userId = req.user?.id || req.user?._id;
    const { lettreDeMotivation, budgetProposer } = req.body || {};

    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    // Prevent duplicate active applications
    const existing = await Candidature.findOne({
      idTache: tacheId,
      idFreelanceur: userId,
      status: { $ne: 'retirer' },
    });
    if (existing) return res.status(409).json({ error: 'Candidature déjà envoyée pour cette tâche' });

    const created = await Candidature.create({
      idTache: tacheId,
      idFreelanceur: userId,
      lettreDeMotivation,
      budgetProposer,
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
};
