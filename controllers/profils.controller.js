import { Profil } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listProfils = list(Profil);
export const getProfil = getOne(Profil);
export const createProfil = createOne(Profil);
export const updateProfil = updateOne(Profil);
export const deleteProfil = deleteOne(Profil);
