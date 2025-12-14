import { Router } from 'express';
import { listContrats, getContrat, createContrat, updateContrat, deleteContrat, listMyContrats } from '../controllers/contrats.controller.js';
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listContrats);
router.get('/mine', protect, listMyContrats);
router.get('/:id', getContrat);
router.post('/', createContrat);
router.put('/:id', updateContrat);
router.delete('/:id', deleteContrat);
export default router;
