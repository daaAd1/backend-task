import sharp from 'sharp';
import fileSystem from '../utils/fileSystemUtils';
import { CustomError } from '../utils/CustomError';

const getResizedImage = async (req, res, next) => {
  try {
    const imageWidth = parseInt(req.params.w);
    const imageHeight = parseInt(req.params.h);
    const galleryName = req.params.path;
    const imageName = req.params[0];
    const fullPath = `db/gallery/${galleryName}${imageName}`;

    if (!fileSystem.doesFileOrDirExist(fullPath)) {
      throw new CustomError(404, 'NOT_FOUND', 'Image not found');
    }

    const image = fileSystem.getImageFromPath(fullPath);
    const imageParams = getImageParams(imageWidth, imageHeight);

    const resizedImg = await resizeImg(image, imageParams);

    res.setHeader('content-type', 'image/jpeg');

    return res.status(200).send(resizedImg);
  } catch (err) {
    next(err);
  }
};

const resizeImg = async (image, imageParams) => {
  return await sharp(image)
    .resize(imageParams)
    .toBuffer()
    .then((data) => data)
    .catch((err) => console.log(err));
};

const getImageParams = (width, height) => {
  if (width === 0) {
    return { height };
  }

  return height === 0 ? { width } : { width, height };
};

export default { getResizedImage };
