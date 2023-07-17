const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../exceptions/errorHandler');

const SECRET_KEY = process.env.JWT_KEY;

function verifyToken(req, res, next) {
  const token = req.cookies.token || '';

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    throw new UnauthorizedError('Access denied');
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin,
};
