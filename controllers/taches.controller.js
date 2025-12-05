import { Tache, Contrat } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';
import { Compte, Escrow } from '../models/index.js';

export const listTaches = list(Tache);
export const getTache = getOne(Tache);
export const createTache = createOne(Tache);
export const updateTache = updateOne(Tache);
export const deleteTache = deleteOne(Tache);

// List only tasks created by the authenticated client
export const listMyTaches = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });
    const rows = await Tache.find({ idClient: clientId });
    res.json(rows);
  } catch (e) { next(e); }
};

// Create task with escrow: deduct budget from client's Compte and lock it in Escrow
// Create task with escrow: deduct budget from client's Compte and lock it in Escrow
export const createTacheWithEscrow = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });

    const { titre, description, budget, type, duree, competences } = req.body || {};
    if (!titre || !description || budget == null || !type || !duree) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    const numericBudget = Number(budget);
    if (!(numericBudget > 0)) return res.status(400).json({ error: 'Budget invalide' });

    const compteClient = await Compte.findOne({ userId: clientId });
    const fraisClient = numericBudget * 0.025;
    const montantADebiter = numericBudget + fraisClient;
    if (!compteClient || compteClient.solde < montantADebiter) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }

    // Normaliser competences en tableau de string
    let competencesArray = [];
    if (Array.isArray(competences)) {
      competencesArray = competences
        .map((c) => (typeof c === 'string' ? c.trim() : c))
        .filter((c) => c && c.length > 0);
    } else if (typeof competences === 'string') {
      // Si jamais le front envoie une seule string séparée par des virgules
      competencesArray = competences
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    // Deduct budget + client fee from client account
    compteClient.solde -= montantADebiter;
    await compteClient.save();

    // Create task
    const tache = await Tache.create({
      idClient: clientId,
      titre,
      description,
      budget: numericBudget,
      type,
      duree,
      status: 'ouvert',
      competences: competencesArray, // <-- ICI
    });

    // Create escrow
    await Escrow.create({
      tacheId: tache._id,
      clientId,
      montant: numericBudget,
      statut: 'bloqué',
    });

    res.status(201).json({ message: 'Tâche créée et montant bloqué', tache });
  } catch (e) { next(e); }
};
// Release escrow when client validates task completion
export const terminerTache = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });

    const { tacheId } = req.params;
    const tache = await Tache.findById(tacheId);
    if (!tache) return res.status(404).json({ message: 'Tâche non trouvée' });
    if (String(tache.idClient) !== String(clientId)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    if (!tache.freelanceId) {
      return res.status(400).json({ message: 'Aucun freelance assigné à cette tâche' });
    }

    const escrow = await Escrow.findOne({ tacheId });
    if (!escrow) return res.status(404).json({ message: 'Escrow introuvable' });
    if (escrow.statut === 'libéré') return res.status(400).json({ message: 'Fonds déjà libérés' });

    const compteFreelance = await Compte.findOne({ userId: tache.freelanceId });
    if (!compteFreelance) return res.status(404).json({ message: 'Compte freelance introuvable' });

    // Fees: only 2.5% freelance at release (client fee was charged at creation)
    const fraisFreelance = escrow.montant * 0.025;
    const montantFinal = escrow.montant - fraisFreelance;

    compteFreelance.solde += montantFinal;
    await compteFreelance.save();

    // Update escrow and task status
    escrow.statut = 'libéré';
    escrow.freelanceId = tache.freelanceId;
    await escrow.save();

    tache.status = 'termine';
    await tache.save();

    // Update related contract to 'termine' and close it
    let contratIdForRating = null;
    try {
      const contrat = await Contrat.findOne({ idTache: tache._id });
      if (contrat) {
        contrat.satuts = 'termine';
        contrat.dateDeFin = new Date();
        await contrat.save();
        contratIdForRating = contrat._id;
      }
    } catch (_) { /* ignore contract update errors to not block payout */ }

    res.status(200).json({
      message: 'Paiement libéré avec succès',
      needEvaluation: true,
      contratId: contratIdForRating,
      freelancerId: tache.freelanceId,
    });
  } catch (e) { next(e); }
};

