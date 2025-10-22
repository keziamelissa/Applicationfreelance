import { Router } from 'express';
import { listCandidatures, getCandidature, createCandidature, updateCandidature, deleteCandidature } from '../controllers/candidatures.controller.js';

const router = Router();
router.get('/', listCandidatures);
router.get('/:id', getCandidature);
router.post('/', createCandidature);
router.put('/:id', updateCandidature);
router.delete('/:id', deleteCandidature);
export default router;
