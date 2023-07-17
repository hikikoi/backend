const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Require auth' });
  }

  jwt.verify(token, jwtKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'require admin role' });
  }

  next();
};

module.exports = {
  authenticateToken,
  checkAdminRole,
};
