const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
require('dotenv').config();
const env = process.env;

//사용방법
//const { authenticateAccessToken } = require('../middlewares/auth.middleware');
//router.post('/comments', authenticateAccessToken, commentController.createComment);

class AuthenticationMiddleware {
  constructor() {
    this.redisClient = new Redis();
  }

  authenticateAccessToken = async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1]; // Bearer 액세스토큰에서 액세스토큰 추출
      const decodedToken = jwt.verify(accessToken, env.ACCESS_KEY);

      // 유효한 액세스 토큰이라면 다음 미들웨어나 API 실행
      req.user = { userId: decodedToken.userId }; // 사용자 정보를 req 객체에 저장
      next();
    } catch (error) {
      // 액세스 토큰이 만료되었을 경우, 리프레시 토큰 검증 미들웨어로 이동
      if (error.name === 'TokenExpiredError') {
        return this.authenticateRefreshToken(req, res, next);
      }
      // 액세스 토큰의 오류라면 오류 메세지
      return res.status(401).json({ message: '액세스 토큰 오류' });
    }
  };

  authenticateRefreshToken = async (req, res, next) => {
    try {
      const refreshToken = await this.redisClient.get(req.user.userId.toString());

      if (!refreshToken) {
        throw { errorCode: 401, message: '리프레시 토큰이 없습니다.' };
      }

      const decodedToken = jwt.verify(refreshToken, env.REFRESH_KEY);

      // 유효한 리프레시 토큰인 경우, 새로운 액세스 토큰 발급
      const newAccessToken = this.generateAccessToken({ userId: decodedToken.userId });
      req.user.newAccessToken = newAccessToken; // 새로운 액세스 토큰을 req 객체에 저장
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '리프레시 토큰 만료' });
      }
      return res.status(401).json({ message: '리프레시 토큰 오류' });
    }
  };

  generateAccessToken = (user) => {
    const accessToken = jwt.sign({ userId: user.userId }, env.ACCESS_KEY, {
      expiresIn: '15m',
    });
    return accessToken;
  };
}

module.exports = AuthenticationMiddleware;
