const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller.js');
const authController = new AuthController();

router.post('/signup', authController.signUp);

router.post('/login', authController.logIn);

router.post('/logout', authController.logOut);

module.exports = router;
