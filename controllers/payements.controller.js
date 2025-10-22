import { Payement } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listPayements = list(Payement);
export const getPayement = getOne(Payement);
export const createPayement = createOne(Payement);
export const updatePayement = updateOne(Payement);
export const deletePayement = deleteOne(Payement);
