const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    files: 2
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const routes = require('./src/routes/routes');
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
