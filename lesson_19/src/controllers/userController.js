const jwt = require('jsonwebtoken');
const fileHelper = require('../helpers/fileHelper');
const {writeFile, readFile} = require('../helpers/fileHelper')
const multer = require('multer');
const path = require('path');
const fs = require('fs')


function profile(req, res, next) {
  const token = req.cookies.token;
  const decodedToken = jwt.decode(token);
  
  if (decodedToken) {
    const { username, role } = decodedToken;
    
    let welcomeMessage = '';
    if (role === 'admin') {
      welcomeMessage = `Welcome admin ${username}`;
    } else {
      welcomeMessage = `Welcome user ${username}`;
    }
    
    res.render('profile', { welcomeMessage });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

function addPhoto(req, res, next) {
  const { title, description, price } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  // Добавление логики для сохранения информации о фото в базе данных или другом хранилище

  res.redirect('/home');
}


const moveFrom = "public/uploads/";
const photos = [];

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
  photos.push(files)
  console.log(photos);
});

function home(req, res, next) {
  // Извлечение пользователя из токена, хранящегося в куках
  const token = req.cookies.token;
  const decodedToken = jwt.decode(token);
  const role = decodedToken.role

  if (decodedToken) {
    res.render('home',  {role, photos}); 
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}


function logout(req, res, next) {
  res.clearCookie('token');;

  const userId = req.user.id;
  const users = fileHelper.readFile('model/users.json');

  const updatedUsers = users.filter((user) => user.id !== userId);
  fileHelper.writeFile('model/users.json', updatedUsers);

  res.redirect('/auth/login');
}


module.exports = {
  profile,
  logout,
  home,
  addPhoto,
};