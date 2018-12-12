const PostGallerySchema = {
  id: 'New gallery insert schema',
  title: 'New gallery insert schema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['name'],
};

export default PostGallerySchema;
