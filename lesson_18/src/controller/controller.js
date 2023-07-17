const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
ejs = require('ejs');
const { loadDataFromJSON,saveDataToJSON } = require('../helper/helper');
const fs = require('fs');
const path = require('path');
const process = require("process");
const moveFrom = "uploads/";
const images = [];

fs.readdir(moveFrom, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach(function (file, index) {
    fromPath = path.join(moveFrom, file);
    fs.stat(fromPath, function (error, stat) {
      if (error) {
        console.error("Error stating file.", error);
        return;
      }
    });
  });
  images.push(files)
  console.log(images);
});


const renderHomePage  = (req, res) => {
  const users = loadDataFromJSON('users.json');
  const posts = loadDataFromJSON('posts.json');
  res.render('index', { users, images});
};

const handleFormSubmission = (req, res) => {
  const { name, email, postText } = req.body;
  // const postImages = req.files['postImages'];

  const users = loadDataFromJSON('users.json');
  // const posts = loadDataFromJSON('posts.json');

  const userId = uuidv4();
  const user = { id: userId, name, email, text: postText };
  users.push(user);

  // const postImagesFilenames = postImages.map((image) => image.filename);
  // const postId = uuidv4();
  // const post = { id: postId, userId, images: postImagesFilenames, text: postText };
  // posts.push(post);

  saveDataToJSON('users.json', users);
  // saveDataToJSON('posts.json', posts);

  res.redirect('/');
};

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send('Failed: Exceeded the maximum number of files.');
    }
  }
  next(err);
};

module.exports = {
  renderHomePage,
  handleFormSubmission,
  multerErrorHandler
};
