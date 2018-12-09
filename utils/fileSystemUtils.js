import { lstatSync, readdirSync, statSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import rimraf from 'rimraf';

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
    const imageName = getFileNameWithoutExtension(path);
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

const getFileNameWithoutExtension = (fileName) =>
  fileName &&
  fileName
    .split('.')
    .slice(0, -1)
    .join('.');

const createDirIfOk = (name) => {
  const fullPath = `db/gallery/${name}`;
  console.log(fullPath);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath);

    return name;
  }
};

const doesFileOrDirExist = (fullPath) => {
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
    const name = getFileNameWithoutExtension(imageName);
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

const deleteGallery = (galleryName) => {
  const fullPath = `db/gallery/${galleryName}`;
  rimraf(fullPath, () => {});
  return true;
};

const createImgUploadSuccessObj = (fullPath, fileName) => {
  const imageStats = statSync(resolve(fullPath), (err) => {
    console.log(err);
  });

  const finalObj = {
    uploaded: {
      path: fileName,
      fullPath: getImagePathFromFullPath(fullPath),
      name: getFileNameWithoutExtension(fileName),
      modified: imageStats.mtime,
    },
  };
  return finalObj;
};

const getImagePathFromFullPath = (fullPath) => {
  const splitPath = fullPath.split('/');
  const lastFolderAndImg = [splitPath[splitPath.length - 2], splitPath[splitPath.length - 1]].join(
    '/',
  );

  return lastFolderAndImg;
};

const getImageFromPath = (fullPath) => {
  return readFileSync(fullPath);
};

export default {
  getGalleryObject,
  isImageInDir,
  createDirIfOk,
  doesFileOrDirExist,
  getGalleryImgObj,
  deleteGallery,
  createImgUploadSuccessObj,
  getImageFromPath,
};
