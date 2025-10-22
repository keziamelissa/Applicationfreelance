import { Tache } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listTaches = list(Tache);
export const getTache = getOne(Tache);
export const createTache = createOne(Tache);
export const updateTache = updateOne(Tache);
export const deleteTache = deleteOne(Tache);
