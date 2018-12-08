import joi from 'joi';

const GalleryModel = {
  galleries: [
    {
      path: joi.string().required(),
      name: joi.string().required(),
    },
  ],
};

export default GalleryModel;
