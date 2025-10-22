import { CompetenceUtilisateurs } from '../models/index.js';

const isCastError = (err) => err?.name === 'CastError' && err?.kind === 'ObjectId';

export const listCompetenceUtilisateurs = async (_req, res, next) => {
  try {
    const rows = await CompetenceUtilisateurs.find();
    res.json(rows);
  } catch (e) { next(e); }
};

export const addCompetenceToUser = async (req, res, next) => {
  try {
    const { idUser, idCompetence } = req.body;
    const created = await CompetenceUtilisateurs.create({ idUser, idCompetence });
    res.status(201).json(created);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Already exists' });
    if (isCastError(e)) return res.status(400).json({ error: 'Invalid id' });
    next(e);
  }
};

export const removeCompetenceFromUser = async (req, res, next) => {
  try {
    const { idUser, idCompetence } = req.body;
    const row = await CompetenceUtilisateurs.findOneAndDelete({ idUser, idCompetence });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) {
    if (isCastError(e)) return res.status(400).json({ error: 'Invalid id' });
    next(e);
  }
};
