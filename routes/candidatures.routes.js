import { Router } from 'express';
import { listCandidatures, getCandidature, createCandidature, updateCandidature, deleteCandidature, acceptCandidature, rejectCandidature, withdrawCandidature } from '../controllers/candidatures.controller.js';
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listCandidatures);
router.get('/:id', getCandidature);
router.post('/', createCandidature);
router.put('/:id', updateCandidature);
router.delete('/:id', deleteCandidature);

// Client actions (ownership verified in controller)
router.post('/:id/accept', protect, acceptCandidature);
router.post('/:id/reject', protect, rejectCandidature);
// Freelancer action: withdraw candidature
router.post('/:id/withdraw', protect, authorize('freelancer'), withdrawCandidature);
export default router;
