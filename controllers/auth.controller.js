const AuthService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  signUp = async (req, res) => {
    try {
      const { loginId, password, userName } = req.body;

      await this.authService.signUp(loginId, password, userName);

      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  logIn = async (req, res) => {
    try {
      const { loginId, password } = req.body;

      const tokens = await this.authService.logIn(loginId, password);

      res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'strict' });
      return res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  logOut = async (req, res) => {
    try {
      console.log('logout Start');
      const accessToken = req.headers.cookie.split('=')[1]; // "Bearer 액세스토큰"에서 액세스토큰 추출

      console.log('🚀 ~ file: auth.controller.js:47 ~ AuthController ~ logOut= ~ accessToken:', accessToken);

      const decodedToken = jwt.decode(accessToken);

      console.log('🚀 ~ file: auth.controller.js:51 ~ AuthController ~ logOut= ~ decodedToken:', decodedToken);

      const userId = decodedToken.userId;
      await this.authService.logOut(userId);

      res.locals.accessToken = null;

      return res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  updateLoginId = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { loginId } = req.body;

      await this.authService.updateLoginId(userId, loginId);

      return res.status(200).json({ message: '로그인 아이디 업데이트 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  updatePassword = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { password, confirmpassword } = req.body;

      await this.authService.updatePassword(userId, password, confirmpassword);

      return res.status(200).json({ message: '비밀번호 업데이트 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  updateUserName = async (req, res) => {
    try {
      const { userName } = req.body;
      const userId = req.user.userId;

      await this.authService.updateUserName(userId, userName);

      return res.status(200).json({ message: '유저네임 업데이트 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  getUserInfo = async (req, res) => {
    try {
      const userId = req.user.userId;

      console.log('🚀 ~ file: auth.controller.js:119 ~ AuthController ~ getUserInfo= ~ userId:', userId);

      const user = await this.authService.getUserInfo(userId);

      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      const userInfo = {
        loginId: user.loginId,
        userName: user.userName,
      };

      return res.status(200).json(userInfo);
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = AuthController;
