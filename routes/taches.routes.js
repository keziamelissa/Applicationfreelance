import { Router } from 'express';
import { protect, authorize } from "../middlewares/auth.middleware.js"
import { listTaches, getTache, createTache, updateTache, deleteTache } from '../controllers/taches.controller.js';

const router = Router();
router.get('/', listTaches);
router.get('/:id', getTache);
router.post('/',protect, authorize("client"), createTache);
router.put('/:id', updateTache);
router.delete('/:id', deleteTache);
export default router;
