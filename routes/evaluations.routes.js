import { Router } from 'express';
import { listEvaluations, getEvaluation, createEvaluation, updateEvaluation, deleteEvaluation } from '../controllers/evaluations.controller.js';

const router = Router();
router.get('/', listEvaluations);
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);
router.put('/:id', updateEvaluation);
router.delete('/:id', deleteEvaluation);
export default router;
