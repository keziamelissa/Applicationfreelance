import { Router } from 'express';
import { listPayements, getPayement, createPayement, updatePayement, deletePayement } from '../controllers/payements.controller.js';

const router = Router();
router.get('/', listPayements);
router.get('/:id', getPayement);
router.post('/', createPayement);
router.put('/:id', updatePayement);
router.delete('/:id', deletePayement);
export default router;
