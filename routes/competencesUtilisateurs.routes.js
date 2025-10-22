import { Router } from 'express';
import { listCompetenceUtilisateurs, addCompetenceToUser, removeCompetenceFromUser } from '../controllers/competencesUtilisateurs.controller.js';

const router = Router();
router.get('/', listCompetenceUtilisateurs);
router.post('/', addCompetenceToUser);
router.delete('/', removeCompetenceFromUser);
export default router;
