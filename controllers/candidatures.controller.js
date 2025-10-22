import { Candidature } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listCandidatures = list(Candidature);
export const getCandidature = getOne(Candidature);
export const createCandidature = createOne(Candidature);
export const updateCandidature = updateOne(Candidature);
export const deleteCandidature = deleteOne(Candidature);
