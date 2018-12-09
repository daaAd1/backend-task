import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import multer from 'multer';

const upload = multer({ dest: './db/' });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
// app.post('/gallery/:path', upload.single('image'), function(req, res) {
//   console.log(req.headers);
//   console.log(req.file, req.files);
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
