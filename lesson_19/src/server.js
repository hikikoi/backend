// src/server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { readFile, writeFile } = require('./helpers/fileHelper');
const { PORT } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./exceptions/errorHandler');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(express.static("public/uploads"));

app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
