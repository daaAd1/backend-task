const GallerySchema = {
  id: 'Gallery list schema',
  title: 'Gallery list schema',
  type: 'object',
  properties: {
    galleries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          name: { type: 'string' },
          image: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              fullpath: { type: 'string' },
              name: { type: 'string' },
              modified: { type: 'string' },
            },
            required: ['path', 'fullpath', 'name', 'modified'],
          },
        },
        required: ['path', 'name'],
      },
    },
  },
  required: ['galleries'],
};

export default GallerySchema;
