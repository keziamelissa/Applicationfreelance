import { Router } from 'express';
import { listProfils, getProfil, createProfil, updateProfil, deleteProfil } from '../controllers/profils.controller.js';

const router = Router();
router.get('/', listProfils);
router.get('/:id', getProfil);
router.post('/', createProfil);
router.put('/:id', updateProfil);
router.delete('/:id', deleteProfil);
export default router;
