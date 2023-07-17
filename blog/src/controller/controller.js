const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
ejs = require('ejs');
const { loadDataFromJSON,saveDataToJSON } = require('../helper/helper');


const renderHomePage  = (req, res) => {
  const users = loadDataFromJSON('users.json');
  const posts = loadDataFromJSON('posts.json');
  res.render('home', { users, posts});
};

const handleFormSubmission = (req, res) => {
  const { name, password, postText } = req.body;
  const postImages = req.files['postImages'];

  const users = loadDataFromJSON('users.json');
  const posts = loadDataFromJSON('posts.json');

  const userId = uuidv4();
  const user = { id: userId, name, password };
  users.push(user);

  const postImagesFilenames = postImages.map((image) => image.filename);
  const postId = uuidv4();
  const post = { id: postId, userId, images: postImagesFilenames, text: postText };
  posts.push(post);

  saveDataToJSON('users.json', users);
  saveDataToJSON('posts.json', posts);

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
