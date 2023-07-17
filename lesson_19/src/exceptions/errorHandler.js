class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
};

module.exports = {
  UnauthorizedError,
  errorHandler,
};
