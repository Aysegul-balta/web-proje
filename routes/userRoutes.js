const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Tarayıcıdan /register adresine girildiğinde çalışır
router.get('/register', userController.getRegisterPage);

// Form "Register" butonuna basılıp gönderildiğinde çalışır
router.post('/register', userController.registerUser);

module.exports = router; 