import User from '../models/user.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listUsers = list(User);
export const getUser = getOne(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
