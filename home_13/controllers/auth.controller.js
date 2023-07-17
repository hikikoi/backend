const { readFile, writeFile } = require('../helpers/file.helper');
const { jwtKey } = require('../config/config');
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await readFile('./data/users.json');
    const user = users.find((user) => user.username === username && user.password === password);

    if (!user){
      res.status(401).json({ message: 'Incorrect password or username' });
    } else{
      const token = jwt.sign({ username: user.username, role: user.role }, jwtKey);
      res.json({ token });
    } 
  } catch (error) {
    res.status(500).json({ message: 'Server error', jwtKey });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await readFile('./data/users.json');
    const userExists = users.some((user) => user.username === username);

    if (!userExists) {
      const newUser = { username, password, role: 'user' };
      users.push(newUser);
      await writeFile('./data/users.json', users);
      res.json({ message: 'Sucsessfully registered' });
    } else {
      res.status(400).json({ message: 'This user already exist' });
    } 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  register,
};
