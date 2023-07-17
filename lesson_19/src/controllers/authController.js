const {writeFile, readFile} = require('../helpers/fileHelper')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_KEY

function register(req, res, next) {
  const { username, password } = req.body;

  const users = readFile('model/users.json');

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length ? users.length + 1 : 1,
    username,
    password,
    role: 'user',
  };

  users.push(newUser);
  writeFile('model/users.json', users);

  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, SECRET_KEY);

  res.cookie('token', token);
  res.setHeader('Authorization', `Bearer ${token}`);

  res.redirect('/users/profile');
}

function login(req, res, next) {
  const { username, password } = req.body;

  const users = readFile('model/users.json');

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);

  res.cookie('token', token);
  res.setHeader('Authorization', `Bearer ${token}`);

  res.redirect('/users/profile');
}

module.exports = {
  register,
  login,
};
