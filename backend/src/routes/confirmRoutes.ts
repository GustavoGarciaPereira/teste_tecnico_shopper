import { Router } from 'express';
import { confirmReading } from '../controllers/confirmController';

const router = Router();

router.patch('/', confirmReading);

export default router;
