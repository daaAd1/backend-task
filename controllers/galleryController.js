import fileSystem from '../utils/fileSystemUtils';

const getGalleries = (req, res) => {
  const source = 'db/gallery';

  res.status(200).send({
    galleries: fileSystem.getGalleryObject(source),
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
      description: "Bad JSON object: u'name' is a required property",
    });
  }

  const result = fileSystem.createDirIfOk(req.body.name);
  if (result) {
    return res.status(201).send({ name: result, path: encodeURIComponent(result.trim()) });
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
  return res.status(200).send({
    gallery: { name: galleryName, path: encodeURIComponent(galleryName.trim()) },
    images: imagesObj,
  });
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

const uploadImage = (req, res) => {
  const galleryName = req.params.path;
  const fullPath = `db/gallery/${galleryName}`;

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

  const succesObj = fileSystem.createImgUploadSuccessObj(req.file.path, req.file.originalname);
  return res.status(201).send(succesObj);
};

export default { getGalleries, createNewGallery, getGalleryDetails, deleteGallery, uploadImage };
