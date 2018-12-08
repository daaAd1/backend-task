import db from '../db/db';
import fileSystem from '../utils/fileSystemUtils';

const getGalleries = (req, res) => {
  const source = 'db/gallery';

  res.status(200).send({
    galleries: fileSystem.getGalleryObject(source),
  });
};

const createNewGallery = (req, res) => {
  if (!req.body.name) {
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

  const result = fileSystem.createDirectoryIfOk(req.body.name);
  if (result) {
    return res.status(201).send({ name: result, path: encodeURIComponent(result.trim()) });
  }

  return res.status(409).send({ message: `dir with name ${name} already exists` });
};

const getGalleryDetails = (req, res) => {
  const galleryName = req.params.path;
  if (!fileSystem.doesDirExist(galleryName)) {
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
  const path = parseInt(req.params.path, 10);

  db.map((gallery, index) => {
    if (gallery.path === path) {
      db.splice(index, 1);
      return res.status(200).send({
        success: 'true',
        message: 'gallery deleted successfuly',
      });
    }
  });

  return res.status(404).send({
    success: 'false',
    message: `gallery with path id${path} not found`,
  });
};

const uploadImage = (req, res) => {
  if (!req.body.path) {
    return res.status(400).send({
      success: 'false',
      message: 'path is required',
    });
  } else if (!req.get('Content-Type')) {
    return res.status(400).send({
      success: 'false',
      message: 'content-type is required',
    });
  }

  return res.status(201).send({
    success: 'true',
    message: 'gallery added successfully',
    gallery,
  });
};

export default { getGalleries, createNewGallery, getGalleryDetails, deleteGallery, uploadImage };
