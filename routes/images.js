import express from 'express';
import fileSystem from '../utils/fileSystemUtils';
import sharp from 'sharp';

const router = express.Router();

router.get('/images/:w\\x:h/:path*', async (req, res) => {
  const imageWidth = parseInt(req.params.w);
  const imageHeight = parseInt(req.params.h);
  const galleryName = req.params.path;
  const imageName = req.params[0];
  const fullPath = `db/gallery/${galleryName}${imageName}`;

  if (!fileSystem.doesFileOrDirExist(fullPath)) {
    return res.status(404).send({
      message: `image with path ${imageName} does not exist`,
    });
  }

  const image = fileSystem.getImageFromPath(fullPath);
  const imageParams = getImageParams(imageWidth, imageHeight);

  const resizedImg = await resizeImg(image, imageParams);

  res.setHeader('content-type', 'image/jpeg');
  res.status(200).send(resizedImg);
});

const resizeImg = async (image, imageParams) => {
  return await sharp(image)
    .resize(imageParams)
    .toBuffer()
    .then((data) => data)
    .catch((error) => res.status(500).send({ error }));
};

const getImageParams = (width, height) => {
  if (width === 0) {
    return { height };
  }

  return height === 0 ? { width } : { width, height };
};

export default router;
