import jsonschema from 'jsonschema';
import GetGallerySchema from '../schemas/GetGallerySchema';
import PostGallerySchema from '../schemas/PostGallerySchema';
import GetGalleryDetailSchema from '../schemas/GetGalleryDetailSchema';
import fileSystem from '../utils/fileSystemUtils';
import facebookUtils from '../utils/facebookUtils';
import { CustomError } from '../utils/CustomError';

const { Validator } = jsonschema;

const getGalleries = (req, res, next) => {
  try {
    const source = 'db/gallery';

    const galleries = fileSystem.getGalleryObject(source);
    const validator = new Validator();
    console.log(validator.validate(galleries, GetGallerySchema));

    return res.status(200).send({
      galleries,
    });
  } catch (err) {
    next(err);
  }
};

const createNewGallery = (req, res, next) => {
  try {
    const galleryName = req.body.name;

    const validator = new Validator();
    console.log(validator.validate(req.body, PostGallerySchema));

    if (!galleryName || galleryName.includes('/')) {
      throw new CustomError(
        400,
        'INVALID_SCHEMA',
        "Bad JSON object: u'name' is a required property or name includes /",
        {
          paths: ['name'],
          validator: 'required',
          example: null,
        },
      );
    }

    const result = fileSystem.createDirIfOk(req.body.name);
    if (!result) {
      throw new CustomError(409, 'ALREADY_EXISTS', 'Gallery already exists');
    }

    const successObj = { name: result, path: encodeURIComponent(result.trim()) };

    return res.status(201).send(successObj);
  } catch (err) {
    next(err);
  }
};

const getGalleryDetails = (req, res, next) => {
  try {
    const galleryName = req.params.path;
    const fullPath = `db/gallery/${galleryName}`;

    if (!fileSystem.doesFileOrDirExist(fullPath)) {
      throw new CustomError(404, 'NOT_FOUND', 'Gallery does not exist');
    }

    const imagesObj = fileSystem.getGalleryImgObj(galleryName);
    const succesObj = {
      gallery: { name: galleryName, path: encodeURIComponent(galleryName.trim()) },
      images: imagesObj,
    };
    const validator = new Validator();
    console.log(validator.validate(succesObj, GetGalleryDetailSchema));

    return res.status(200).send(succesObj);
  } catch (err) {
    next(err);
  }
};

const deleteGallery = (req, res, next) => {
  try {
    const galleryName = req.params.path;
    const fullPath = `db/gallery/${galleryName}`;
    const imageName = req.param(0);

    if (
      !fileSystem.doesFileOrDirExist(fullPath) ||
      !fileSystem.doesFileOrDirExist(`db/gallery/${galleryName}/${imageName}`)
    ) {
      throw new CustomError(404, 'NOT_FOUND', 'Gallery/image does not exist');
    }

    const pathToImage = imageName ? `${galleryName}/${imageName}` : galleryName;
    fileSystem.deleteGallery(pathToImage);

    return res.status(200).send({
      statusCode: 200,
      name: 'success',
      description: `Gallery/image successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const galleryName = req.params.path;
    const fullPath = `db/gallery/${galleryName}`;
    const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];
    const { originalname, path } = req.file;

    if (!req.file) {
      throw new CustomError(400, 'BAD_REQUEST', 'No image to upload');
    } else if (!req.get('Content-Type')) {
      throw new CustomError(400, 'BAD_REQUEST', 'Content type is required');
    } else if (!fileSystem.doesFileOrDirExist(fullPath)) {
      fileSystem.deleteMulterCreatedFile(`db/${originalname}`);
      throw new CustomError(404, 'NOT_FOUND', 'Gallery does not exist');
    }

    const id = await facebookUtils.getUserId(token);

    if (!id) {
      throw new CustomError(401, 'UNAUTHORIZED', 'Token is not valid');
    }

    const fileNameWithId = fileSystem.createNewFileName(id, originalname);
    const fileNameWithIdPath = fileSystem.createNewFileNamePath(path, fileNameWithId);

    fileSystem.renameFile(path, fileNameWithIdPath);

    const succesObj = fileSystem.createImgUploadSuccessObj(fileNameWithIdPath, fileNameWithId);

    return res.status(201).send(succesObj);
  } catch (err) {
    next(err);
  }
};

export default { getGalleries, createNewGallery, getGalleryDetails, deleteGallery, uploadImage };
