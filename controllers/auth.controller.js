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

      res.cookie('access_token', tokens.accessToken, { httpOnly: false, sameSite: 'strict' });
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
      const accessToken = req.headers.authorization.split(' ')[1]; // "Bearer 액세스토큰"에서 액세스토큰 추출
      const decodedToken = jwt.verify(accessToken, env.ACCESS_KEY);

      const userId = decodedToken.userId;
      await this.authService.logOut(userId);

      return res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = AuthController;
