import { Router } from 'express';
import { listCandidatures, getCandidature, createCandidature, updateCandidature, deleteCandidature, acceptCandidature, rejectCandidature } from '../controllers/candidatures.controller.js';
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listCandidatures);
router.get('/:id', getCandidature);
router.post('/', createCandidature);
router.put('/:id', updateCandidature);
router.delete('/:id', deleteCandidature);

// Client actions
router.post('/:id/accept', protect, authorize('client'), acceptCandidature);
router.post('/:id/reject', protect, authorize('client'), rejectCandidature);
export default router;
