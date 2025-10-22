import { Contrat } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listContrats = list(Contrat);
export const getContrat = getOne(Contrat);
export const createContrat = createOne(Contrat);
export const updateContrat = updateOne(Contrat);
export const deleteContrat = deleteOne(Contrat);
