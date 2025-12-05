import { Router } from 'express';
import { protect, authorize } from "../middlewares/auth.middleware.js"
import { listRevisions, getRevisions, createRevisions, updateRevisions, deleteRevisions } from '../controllers/revisions.contoller.js';
//import { createRevisions, deleteRevisions, getRevisions, updateRevisions } from '../controllers/revisions.contoller.js';

const router = Router();
router.get('/', listRevisions);
router.get('/:id', getRevisions);
router.post('/',protect, authorize("client"), createRevisions);
router.put('/:id', updateRevisions);
router.delete('/:id', deleteRevisions);
export default router;
