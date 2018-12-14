import graph from 'fbgraph';

const authMiddleware = (req, res, next) => {
  const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];

  if (token) {
    try {
      graph.setAccessToken(token);
      return next();
    } catch (err) {
      return res.status(401).send({
        message: 'not authorized',
      });
    }
  }

  return res.status(401).send({
    message: 'not authorized',
  });
};

export default authMiddleware;
