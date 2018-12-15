import graph from 'fbgraph';

const authMiddleware = (req, res, next) => {
  const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];

  // check auth only on post image request
  const isCorrectRoute = checkIfCorrectRoute(req.url) && req.method === 'POST';

  if (!isCorrectRoute) {
    return next();
  }

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

const checkIfCorrectRoute = (url) => {
  const urlArray = url.split('/');

  const removeEmpty = urlArray.filter((item) => item !== '');

  return removeEmpty.length === 2;
};

export default authMiddleware;
