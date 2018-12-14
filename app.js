import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import CustomError from './utils/CustomError';
import authMiddleware from './middlewares/authMiddleware';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authMiddleware);
app.use(router);

app.get('/', function(req, res) {
  throw new CustomError('ERRRRRRORRRRR');
});

//MIDDLEWARE NA AUTH

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
