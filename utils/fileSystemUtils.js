import { lstatSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const getGalleryObject = (sourceDir) =>
  readdirSync(sourceDir)
    .filter((name) => isDirectory(join(sourceDir, name)))
    .map((name) => {
      return createGalleryObject(name, sourceDir);
    });

const isDirectory = (path) => lstatSync(path).isDirectory();

const createGalleryObject = (name, sourceDir) => {
  const resultObj = { name, path: encodeURIComponent(name && name.trim()) };

  resultObj.image = putImagePropertiesIfImageExistsInDir(sourceDir, name);

  return resultObj;
};

const putImagePropertiesIfImageExistsInDir = (sourceDir, name) => {
  const dirContent = readdirSync(join(sourceDir, name));

  if (isImageInDir(dirContent)) {
    const path = dirContent[0];
    const imageName = getFileNameWithouExtenstion(path);
    const fullPath = `${name}/${path}`;
    const imageStats = statSync(resolve(`db/gallery/${fullPath}`), (err) => {
      console.log(err);
    });

    return { path, name: imageName, fullPath, modified: imageStats.mtime };
  }
};

const isImageInDir = (dirContent) => {
  return dirContent.length > 0;
};

const getFileNameWithoutExtenstion = (fileName) =>
  fileName
    .split('.')
    .slice(0, -1)
    .join('.');

const createDirectoryIfOk = (name) => {
  const fullPath = `db/gallery/${name}`;

  if (!existsSync(fullPath)) {
    mkdirSync(fullPath);

    return name;
  }
};

const doesDirExist = (path) => {
  const fullPath = `db/gallery/${path}`;

  return existsSync(fullPath);
};

const getGalleryImgObj = (galleryName) => {
  const fullPath = `db/gallery/${galleryName}`;
  const dirContent = readdirSync(fullPath);

  if (isImageInDir(dirContent)) {
    return createImgArray(dirContent, galleryName);
  }

  return {};
};

const createImgArray = (dirContent, galleryName) => {
  return dirContent.map((imageName) => {
    const name = getFileNameWithoutExtenstion(imageName);
    const fullPath = `${galleryName}/${imageName}`;
    const imageStats = statSync(resolve(`db/gallery/${fullPath}`), (err) => {
      console.log(err);
    });

    return {
      path: encodeURIComponent(imageName && imageName.trim()),
      name,
      fullPath,
      modified: imageStats.mtime,
    };
  });
};

export default {
  getGalleryObject,
  isImageInDir,
  createDirectoryIfOk,
  doesDirExist,
  getGalleryImgObj,
};
