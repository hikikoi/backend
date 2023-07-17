const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { renderHomePage, handleFormSubmission } = require('../controller/controller');

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

const upload = multer({ storage: storage });

router.get('/', renderHomePage);

router.post('/submit', upload.fields([{  maxCount: 1 }, { name: 'postImages', maxCount: 2 }]), handleFormSubmission);

module.exports = router;
