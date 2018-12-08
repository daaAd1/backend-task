import express from 'express';
import db from '../db/db';

const router = express.Router();

router.get('/images', (req, res) => {
  res.status(200).send({
    gallery: db,
    // title: 'Gallery list schema',
    // type: 'object',
    // properties: {
    //   galleries: {
    //     type: 'array',
    //     items: {
    //       type: 'object',
    //       properties: {
    //         path: { type: 'string' },
    //         name: { type: 'string' },
    //         image: {
    //           type: 'object',
    //           properties: {
    //             path: { type: 'string' },
    //             fullpath: { type: 'string' },
    //             name: { type: 'string' },
    //             modified: { type: 'string' },
    //           },
    //           required: ['path', 'fullpath', 'name', 'modified'],
    //         },
    //       },
    //       required: ['path', 'name'],
    //     },
    //   },
    // },
    // required: ['galleries'],
    // additionalProperties: true,
  });
});

export default router;
