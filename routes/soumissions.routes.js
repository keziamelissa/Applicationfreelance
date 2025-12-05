import { Router } from 'express';
import { listSoumissions, getSoumission, createSoumission, updateSoumission, deleteSoumission, createSoumissionWithFiles } from '../controllers/soumissions.controller.js';
import { uploadDeliveries } from '../middlewares/upload.middleware.js';

const router = Router();
router.get('/', listSoumissions);
router.get('/:id', getSoumission);
router.post('/', uploadDeliveries.array('files'), createSoumissionWithFiles);
router.post('/with-files', uploadDeliveries.array('files'), createSoumissionWithFiles);
router.put('/:id', updateSoumission);
router.delete('/:id', deleteSoumission);
export default router;
