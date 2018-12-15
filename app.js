import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import { CustomError } from './utils/CustomError';
import fileSystem from './utils/fileSystemUtils';
import authMiddleware from './middlewares/authMiddleware';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// bad route handler
router.use((req, res, next) => {
  if (!req.route) {
    throw new CustomError(404, 'NOT_FOUND', 'Route is not defined');
  }
});

// checks if db and db/gallery folders exist before handling routes
app.use((req, res, next) => {
  fileSystem.checkIfGalleryFolderExistsAndCreateItIfNeeded();
  next();
});

app.use(authMiddleware);
app.use(router);

// error handler
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;

  return res.json({
    statusCode: err.statusCode,
    name: err.name,
    description: err.description,
    payload: err.payload,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
