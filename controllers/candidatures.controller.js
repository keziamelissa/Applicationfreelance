import { Candidature, Tache, Contrat, User } from '../models/index.js';
import { notifyUser, notifyAdmins } from '../services/notifications.service.js';
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
    const [rows, contr] = await Promise.all([
      Candidature
        .find({ idTache: tacheId })
        .populate('idFreelanceur', 'nom prenom profile_photo'),
      Contrat.findOne({ idTache: tacheId }).lean()
    ]);
    const withFlag = rows.map(r => ({ ...r.toObject(), _contractExists: !!contr }));
    res.json(withFlag);
  } catch (e) { next(e); }
};

// Accept a candidature as the authenticated client: assign freelancer to task and create a contract
export const acceptCandidature = async (req, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id;
    const { id } = req.params; // candidature id
    const { dateDeDebut, dateDeFin } = req.body || {};
    if (!clientId) return res.status(401).json({ error: 'Non authentifié' });
    if (!dateDeDebut || !dateDeFin) return res.status(400).json({ error: 'Les dates de début et de fin sont obligatoires' });

    const cand = await Candidature.findById(id);
    if (!cand) return res.status(404).json({ error: 'Candidature non trouvée' });

    const tache = await Tache.findById(cand.idTache);
    if (!tache) return res.status(404).json({ error: 'Tâche non trouvée' });
    if (String(tache.idClient) !== String(clientId)) return res.status(403).json({ error: 'Accès refusé' });

    // Prevent creating a second contract for the same task
    const existingContrat = await Contrat.findOne({ idTache: tache._id });
    if (existingContrat) return res.status(409).json({ error: 'Un contrat existe déjà pour cette tâche' });

    // Assign freelancer to task and move status to enCours without triggering full schema validation
    await Tache.updateOne(
      { _id: tache._id },
      { $set: { freelanceId: cand.idFreelanceur, status: 'enCours' } }
    );

    // Create contract
    const startDate = new Date(dateDeDebut);
    const endDate = new Date(dateDeFin);
    if (Number.isNaN(startDate.getTime())) return res.status(400).json({ error: 'dateDeDebut invalide' });
    if (Number.isNaN(endDate.getTime())) return res.status(400).json({ error: 'dateDeFin invalide' });
    if (endDate < startDate) return res.status(400).json({ error: 'La date de fin doit être postérieure à la date de début' });

    const contrat = await Contrat.create({
      idTache: tache._id,
      idClient: tache.idClient,
      idFreelanceur: cand.idFreelanceur,
      type: tache.type,
      montantConvenu: cand.budgetProposer ?? tache.budget,
      satuts: 'enCours',
      dateDeDebut: startDate,
      dateDeFin: endDate,
    });

    // Update candidature status only after successful contract creation
    cand.status = 'accepte';
    await cand.save();

    // Notify freelancer and admins (include contract dates)
    const fmt = (d) => new Intl.DateTimeFormat('fr-FR').format(d);
    await notifyUser(
      cand.idFreelanceur,
      'candidature.accepted',
      `Votre candidature pour "${tache.titre}" a été acceptée. Le contrat commence le ${fmt(startDate)} et se termine le ${fmt(endDate)}.`
    );
    // Enrichir la notification admin avec les acteurs et les dates
    try {
      const [freel, client] = await Promise.all([
        User.findById(cand.idFreelanceur, 'nom prenom email').lean(),
        User.findById(tache.idClient, 'nom prenom email').lean(),
      ])
      const full = (u) => (u ? ([u.prenom, u.nom].filter(Boolean).join(' ') || u.email || String(u._id)) : 'N/A')
      await notifyAdmins(
        'candidature.accepted',
        `Candidature acceptée: le client ${full(client)} a accepté ${full(freel)} pour "${tache.titre}" (du ${fmt(startDate)} au ${fmt(endDate)}).`
      )
    } catch (_) {
      await notifyAdmins('candidature.accepted', `Une candidature a été acceptée pour la tâche "${tache.titre}".`)
    }

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
    // Notify freelancer and admins
    await notifyUser(cand.idFreelanceur, 'candidature.rejected', `Votre candidature pour "${tache.titre}" a été refusée.`);
    try {
      const [freel, client] = await Promise.all([
        User.findById(cand.idFreelanceur, 'nom prenom email').lean(),
        User.findById(tache.idClient, 'nom prenom email').lean(),
      ])
      const full = (u) => (u ? ([u.prenom, u.nom].filter(Boolean).join(' ') || u.email || String(u._id)) : 'N/A')
      await notifyAdmins(
        'candidature.rejected',
        `Candidature refusée: le client ${full(client)} a refusé ${full(freel)} pour "${tache.titre}".`
      )
    } catch (_) {
      await notifyAdmins('candidature.rejected', `Une candidature a été refusée pour la tâche "${tache.titre}".`)
    }
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
    // Notify client owner and admins
    try {
      const tache = await Tache.findById(tacheId);
      if (tache?.idClient) {
        await notifyUser(tache.idClient, 'candidature.new', `Nouvelle candidature reçue pour votre tâche "${tache.titre}".`);
      }
      try {
        const [freel, client] = await Promise.all([
          User.findById(userId, 'nom prenom email').lean(),
          User.findById(tache.idClient, 'nom prenom email').lean(),
        ])
        const full = (u) => (u ? ([u.prenom, u.nom].filter(Boolean).join(' ') || u.email || String(u._id)) : 'N/A')
        await notifyAdmins(
          'candidature.new',
          `Nouvelle candidature: ${full(freel)} a postulé à "${tache.titre}" (client: ${full(client)}).`
        )
      } catch (_) {
        await notifyAdmins('candidature.new', `Un freelance a postulé à la tâche "${tache?.titre || tacheId}".`)
      }
    } catch { }

    res.status(201).json(created);
  } catch (e) { next(e); }
};

// Withdraw candidature by freelancer
export const withdrawCandidature = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });
    const { id } = req.params; // candidature id
    const cand = await Candidature.findById(id);
    if (!cand) return res.status(404).json({ error: 'Candidature non trouvée' });
    if (String(cand.idFreelanceur) !== String(userId)) return res.status(403).json({ error: 'Accès refusé' });
    cand.status = 'retirer';
    await cand.save();
    try {
      const tache = await Tache.findById(cand.idTache);
      if (tache?.idClient) {
        await notifyUser(tache.idClient, 'candidature.withdrawn', `Un freelance a retiré sa candidature pour votre tâche "${tache.titre}".`);
      }
      try {
        const [freel, client] = await Promise.all([
          User.findById(cand.idFreelanceur, 'nom prenom email').lean(),
          tache?.idClient ? User.findById(tache.idClient, 'nom prenom email').lean() : null,
        ])
        const full = (u) => (u ? ([u.prenom, u.nom].filter(Boolean).join(' ') || u.email || String(u._id)) : 'N/A')
        await notifyAdmins('candidature.withdrawn', `Candidature retirée: ${full(freel)} a retiré sa candidature pour "${tache?.titre || cand.idTache}" (client: ${full(client)}).`)
      } catch (_) {
        await notifyAdmins('candidature.withdrawn', `Une candidature a été retirée pour la tâche "${tache?.titre || cand.idTache}".`)
      }
    } catch { }
    res.status(200).json({ message: 'Candidature retirée' });
  } catch (e) { next(e); }
};
