import express from 'express';
import multer from 'multer';
import gallery from '../controllers/galleryController';

const upload = multer({ dest: 'db/' });

const router = express.Router();

router.get('/gallery', gallery.getGalleries);

router.post('/gallery', gallery.createNewGallery);

router.get('/gallery/:path', gallery.getGalleryDetails);

router.delete('/gallery/:path', gallery.deleteGallery);

router.post('/gallery/:path', upload.single(), gallery.uploadImage);

export default router;
