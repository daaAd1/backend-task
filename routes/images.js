import express from 'express';
import imageController from '../controllers/imageController';

const router = express.Router();

router.get('/images/:w\\x:h/:path*', imageController.getResizedImage);

export default router;
