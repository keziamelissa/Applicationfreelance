import { Revision } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listRevisions = list(Revision);
export const getRevisions = getOne(Revision);
export const createRevisions = createOne(Revision);
export const updateRevisions = updateOne(Revision);
export const deleteRevisions = deleteOne(Revision);
