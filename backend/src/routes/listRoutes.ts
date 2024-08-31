import { Router } from 'express';
import { listReadings } from '../controllers/listController';

const router = Router();

router.get('/', listReadings);

export default router;
