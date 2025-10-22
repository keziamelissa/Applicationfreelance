import { Router } from 'express';
import { listCompetences, getCompetence, createCompetence, updateCompetence, deleteCompetence } from '../controllers/competences.controller.js';

const router = Router();
router.get('/', listCompetences);
router.get('/:id', getCompetence);
router.post('/', createCompetence);
router.put('/:id', updateCompetence);
router.delete('/:id', deleteCompetence);
export default router;
