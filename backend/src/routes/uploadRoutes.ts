import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';

const router = Router();

// Use o middleware para upload de arquivos
router.post('/', uploadMiddleware, uploadImage);

export default router;
