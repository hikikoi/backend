const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/login', authController.login);
router.get('/login', (req, res) => {
    res.render('login');
})

module.exports = router;
