import graph from 'fbgraph';
import { CustomError } from '../utils/CustomError';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];

    // check auth only on post image request
    const isCorrectRoute = checkIfCorrectRoute(req.url) && req.method === 'POST';

    if (!isCorrectRoute) {
      return next();
    }

    if (!token) {
      throw new CustomError(401, 'UNAUTHORIZED', 'No token found');
    }

    try {
      graph.setAccessToken(token);
    } catch (err) {
      throw new CustomError(401, 'UNAUTHORIZED', 'Not authorized');
    }
    return next();
  } catch (err) {
    next(err);
  }
};

const checkIfCorrectRoute = (url) => {
  const urlArray = url.split('/');

  const removeEmpty = urlArray.filter((item) => item !== '');

  return removeEmpty.length === 2;
};

export default authMiddleware;
