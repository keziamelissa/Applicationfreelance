import { Competence } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listCompetences = list(Competence);
export const getCompetence = getOne(Competence);
export const createCompetence = createOne(Competence);
export const updateCompetence = updateOne(Competence);
export const deleteCompetence = deleteOne(Competence);
