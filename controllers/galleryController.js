import graph from 'fbgraph';
import jsonschema from 'jsonschema';
const { Validator } = jsonschema;
import GetGallerySchema from '../schemas/GetGallerySchema';
import PostGallerySchema from '../schemas/PostGallerySchema';
import GetGalleryDetailSchema from '../schemas/GetGalleryDetailSchema';
import fileSystem from '../utils/fileSystemUtils';

const getGalleries = (req, res) => {
  const source = 'db/gallery';

  const galleries = fileSystem.getGalleryObject(source);
  const validator = new Validator();
  console.log(validator.validate(galleries, GetGallerySchema));

  res.status(200).send({
    galleries,
  });
};

const createNewGallery = (req, res) => {
  const galleryName = req.body.name;
  if (!galleryName || galleryName.includes('/')) {
    return res.status(400).send({
      code: 400,
      payload: {
        paths: ['name'],
        validator: 'required',
        example: null,
      },
      name: 'INVALID_SCHEMA',
      description: "Bad JSON object: u'name' is a required property or name includes /",
    });
  }

  const result = fileSystem.createDirIfOk(req.body.name);
  if (result) {
    const succesObj = { name: result, path: encodeURIComponent(result.trim()) };
    const validator = new Validator();
    console.log(validator.validate(succesObj, PostGallerySchema));
    return res.status(201).send(succesObj);
  }

  return res.status(409).send({ message: `dir with name ${galleryName} already exists` });
};

const getGalleryDetails = (req, res) => {
  const galleryName = req.params.path;
  const fullPath = `db/gallery/${galleryName}`;

  if (!fileSystem.doesFileOrDirExist(fullPath)) {
    return res.status(404).send({
      message: `gallery with path ${galleryName} does not exist`,
    });
  }

  const imagesObj = fileSystem.getGalleryImgObj(galleryName);
  const succesObj = {
    gallery: { name: galleryName, path: encodeURIComponent(galleryName.trim()) },
    images: imagesObj,
  };
  const validator = new Validator();
  console.log(validator.validate(succesObj, GetGalleryDetailSchema));
  return res.status(200).send(succesObj);
};

const deleteGallery = (req, res) => {
  const galleryName = req.params.path;
  const fullPath = `db/gallery/${galleryName}`;
  const imageName = req.param(0);
  if (
    !fileSystem.doesFileOrDirExist(fullPath) ||
    !fileSystem.doesFileOrDirExist(`db/gallery/${galleryName}/${imageName}`)
  ) {
    return res.status(404).send({
      message: `gallery/image with path ${galleryName} does not exist`,
    });
  }

  try {
    const pathToImage = imageName ? `${galleryName}/${imageName}` : galleryName;
    fileSystem.deleteGallery(pathToImage);
    return res.status(200).send({
      message: `gallery/image successfully deleted`,
    });
  } catch (err) {
    return res.status(500).send({});
  }
};

const uploadImage = async (req, res) => {
  const galleryName = req.params.path;
  const fullPath = `db/gallery/${galleryName}`;
  const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];

  if (!req.file) {
    return res.status(400).send({
      message: 'no file was chosen',
    });
  } else if (!req.get('Content-Type')) {
    return res.status(400).send({
      message: 'content-type is required',
    });
  } else if (!fileSystem.doesFileOrDirExist(fullPath)) {
    return res.status(404).send({
      message: `gallery with path ${galleryName} does not exist`,
    });
  }

  if (token) {
    graph.setAccessToken(token);
  } else {
    return res.status(401).send({
      message: 'not authorized',
    });
  }

  let id = 0;

  const options = {
    timeout: 3000,
    pool: { maxSockets: Infinity },
    headers: { connection: 'keep-alive' },
  };

  async function start() {
    let promise = await new Promise((resolve, reject) => {
      graph.setOptions(options).get('me', (err, res) => {
        id = res.id;
        resolve();
      });
    }).catch((err) => {
      throw err;
    });

    return promise;
  }

  await start()
    .then(() => {})
    .catch(() => {});

  const { originalname, path } = req.file;

  const fileNameWithId = fileSystem.createNewFileName(id, originalname);
  const fileNameWithIdPath = fileSystem.createNewFileNamePath(path, fileNameWithId);

  fileSystem.renameFile(path, fileNameWithIdPath);

  const succesObj = fileSystem.createImgUploadSuccessObj(fileNameWithIdPath, fileNameWithId);
  return res.status(201).send(succesObj);
};

export default { getGalleries, createNewGallery, getGalleryDetails, deleteGallery, uploadImage };
