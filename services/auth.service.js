const AuthRepository = require('../repositories/auth.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
require('dotenv').config();
const env = process.env;

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.redisClient = new Redis();
  }

  signUp = async (loginId, password, userName) => {
    const existUser = await this.authRepository.findUserByLoginId(loginId);

    if (existUser) {
      throw { errorCode: 400, message: '이미 존재하는 유저아이디.' };
    }

    if (!loginId || !password || !userName) {
      throw { errorCode: 412, message: '데이터를 모두 입력해야 됨.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authRepository.createUser(loginId, hashedPassword, userName);
  };

  logIn = async (loginId, password) => {
    const user = await this.authRepository.findUserByLoginId(loginId);

    if (!user) {
      throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { errorCode: 401, message: '비밀번호가 일치하지 않습니다.' };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Redis에 리프레시 토큰 저장
    await this.redisClient.set(user.id.toString(), refreshToken);

    return { accessToken, refreshToken };
  };

  logOut = async (userId) => {
    const user = await this.authRepository.findUserByUserId(userId);

    // Redis에서 해당 사용자의 리프레시 토큰 삭제
    await this.redisClient.del(user.loginId.toString());
  };
}

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ userId: user.id }, env.ACCESS_KEY, {
    expiresIn: '10s',
  });
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user.id }, env.REFRESH_KEY, {
    expiresIn: '7d',
  });
  return refreshToken;
};

module.exports = AuthService;
