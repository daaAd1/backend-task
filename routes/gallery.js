import express from 'express';
import multer from 'multer';
import gallery from '../controllers/galleryController';
import fileSystem from '../utils/fileSystemUtils';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // have to check if dir exists first, it is deleted later
    if (fileSystem.doesFileOrDirExist(`db/req.url`)) {
      cb(null, `./db${req.url}`);
    } else {
      cb(null, `./db`);
    }
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
