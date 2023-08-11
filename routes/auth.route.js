const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller.js');
const authController = new AuthController();
const Authmiddleware = require('../middlewares/auth.middleware');
const authmiddleware = new Authmiddleware();

router.post('/signup', authController.signUp);

router.post('/login', authController.logIn);

router.post('/logout', authController.logOut);

router.patch('/account/loginId/', authmiddleware.authenticateAccessToken, authController.updateLoginId);

router.patch('/account/password/', authmiddleware.authenticateAccessToken, authController.updatePassword);

router.patch('/account/userName/', authmiddleware.authenticateAccessToken, authController.updateUserName);

router.get('/account/', authmiddleware.authenticateAccessToken, authController.getUserInfo);

module.exports = router;
