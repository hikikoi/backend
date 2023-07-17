const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;

module.exports = {
  PORT
};
