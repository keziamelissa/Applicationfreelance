import { Router } from 'express';
import { listEvaluations, getEvaluation, createEvaluation, updateEvaluation, deleteEvaluation, evaluationExists } from '../controllers/evaluations.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/', listEvaluations);
router.get('/exists', evaluationExists);
router.get('/:id', getEvaluation);
router.post('/', protect, authorize('client'), createEvaluation);
router.put('/:id', updateEvaluation);
router.delete('/:id', deleteEvaluation);
export default router;
