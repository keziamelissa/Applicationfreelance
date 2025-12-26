import { Evaluation } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listEvaluations = list(Evaluation);
export const getEvaluation = getOne(Evaluation);
export const createEvaluation = async (req, res, next) => {
  try {
    const row = await Evaluation.create(req.body);
    res.status(201).json(row);
  } catch (e) {
    if (e && e.code === 11000) return res.status(409).json({ error: 'Evaluation already exists' });
    next(e);
  }
};
export const updateEvaluation = updateOne(Evaluation);
export const deleteEvaluation = deleteOne(Evaluation);

export const evaluationExists = async (req, res, next) => {
  try {
    const { contratId, clientId } = req.query;
    if (!contratId) return res.status(400).json({ error: 'contratId is required' });

    const where = { contratId };
    if (clientId) where.clientId = clientId;

    const doc = await Evaluation.findOne(where).lean();
    res.json({ exists: !!doc });
  } catch (e) {
    next(e);
  }
};
