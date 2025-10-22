import { Router } from 'express';
import { listContrats, getContrat, createContrat, updateContrat, deleteContrat } from '../controllers/contrats.controller.js';

const router = Router();
router.get('/', listContrats);
router.get('/:id', getContrat);
router.post('/', createContrat);
router.put('/:id', updateContrat);
router.delete('/:id', deleteContrat);
export default router;
