const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  };
  