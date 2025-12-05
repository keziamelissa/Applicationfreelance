import { Router } from 'express';
import { protect, authorize } from "../middlewares/auth.middleware.js"
import { listTaches, getTache, createTacheWithEscrow, updateTache, deleteTache, listMyTaches, terminerTache } from '../controllers/taches.controller.js';
import { listCandidaturesByTache, applyToTache } from '../controllers/candidatures.controller.js';

const router = Router();
router.get('/', listTaches);
// Client's own tasks should be before dynamic ':id'
router.get('/mine', protect, authorize("client"), listMyTaches);
router.get('/:id', getTache);
router.post('/', protect, authorize("client"), createTacheWithEscrow);
router.put('/:id', updateTache);
router.delete('/:id', deleteTache);

// Nested candidature routes for a given tache
router.get('/:tacheId/candidatures', listCandidaturesByTache);
router.post('/:tacheId/candidatures/apply', protect, authorize("freelancer"), applyToTache);

// Terminer une tâche et libérer le paiement (client seulement)
router.post('/:tacheId/terminer', protect, authorize("client"), terminerTache);
export default router;
