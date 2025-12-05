import { Evaluation } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listEvaluations = list(Evaluation);
export const getEvaluation = getOne(Evaluation);
export const createEvaluation = createOne(Evaluation);
export const updateEvaluation = updateOne(Evaluation);
export const deleteEvaluation = deleteOne(Evaluation);
