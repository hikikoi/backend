const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware.verifyToken, userController.profile);
router.get('/home', authMiddleware.verifyToken, userController.home);
router.post('/home', authMiddleware.verifyToken, userController.addPhoto);
router.get('/logout', authMiddleware.verifyToken, userController.logout);

module.exports = router;
