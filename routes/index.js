import express from 'express';
import gallery from './gallery';
import images from './images';

const router = express.Router();
router.use(gallery);
router.use(images);

export default router;
