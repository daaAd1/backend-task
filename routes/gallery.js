import express from 'express';
import multer from 'multer';
import gallery from '../controllers/galleryController';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./db${req.url}`);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/gallery', gallery.getGalleries);

router.post('/gallery', gallery.createNewGallery);

router.get('/gallery/:path', gallery.getGalleryDetails);

router.delete('/gallery/:path*', gallery.deleteGallery);

router.post('/gallery/:path', upload.single('avatar'), gallery.uploadImage);

export default router;
