import { Router } from 'express';
import { listProfils, getProfil, createProfil, updateProfil, deleteProfil, getProfilByUser, uploadProfilCV, upsertProfilByUser } from '../controllers/profils.controller.js';
import { uploadCV } from '../middlewares/upload.middleware.js';

const router = Router();
router.get('/', listProfils);
// Specific routes must come before the generic '/:id'
router.get('/by-user/:userId', getProfilByUser);
router.put('/by-user/:userId', upsertProfilByUser);
router.get('/:id', getProfil);
router.post('/', createProfil);
router.put('/:id', updateProfil);
router.post('/:id/cv', uploadCV.single('cv'), uploadProfilCV);
router.delete('/:id', deleteProfil);
export default router;
