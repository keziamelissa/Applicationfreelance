import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser, getUserDashboard } from '../controllers/users.controller.js';

const router = Router();
router.get('/', listUsers);
// Dashboard must be defined before '/:id' to prevent conflicts
router.get('/:id/dashboard', getUserDashboard);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
