const GalleryDetailSchema = {
  id: 'Gallery detail schema',
  title: 'Gallery detail schema',
  type: 'object',
  properties: {
    gallery: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['path', 'name'],
    },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          fullPath: { type: 'string' },
          name: { type: 'string' },
          modified: { type: 'string' },
        },
        required: ['path', 'fullpath', 'name', 'modified'],
      },
    },
  },
  required: ['gallery', 'images'],
};

export default GalleryDetailSchema;
