const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
require('dotenv').config();
const env = process.env;

//사용방법
//const AuthenticationMiddleware = require('../middlewares/auth.middleware');
//const authMiddleware = new AuthenticationMiddleware();
//router.post('/comments', authMiddleware.authenticateAccessToken, (req, res) => {}

//포스트맨
//Authorization 탭에 Type을 Bearer Token으로 변경한 뒤 로그인 응답에서 받아온 액세스 토큰 입력
//썬더클라이언트
//Headers탭에 hearder를 Authorization, value에는 Bearer 액세스 토큰

class AuthenticationMiddleware {
  constructor() {
    this.redisClient = new Redis();
  }

  authenticateAccessToken = async (req, res, next) => {
    try {
      console.log(req.headers);
      const accessToken = req.headers.cookie.split('=')[1]; // Bearer 액세스토큰에서 액세스토큰 추출

      console.log(
        '🚀 ~ file: auth.middleware.js:26 ~ AuthenticationMiddleware ~ authenticateAccessToken= ~ accessToken:',
        accessToken,
      );

      // postman
      const decodedToken = jwt.verify(accessToken, env.ACCESS_KEY);

      // 유효한 액세스 토큰이라면 다음 미들웨어나 API 실행
      req.user = { userId: decodedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장
      next();
    } catch (error) {
      // 액세스 토큰이 만료되었을 경우, 리프레시 토큰 검증 미들웨어로 이동
      if (error.name === 'TokenExpiredError') {
        console.log(
          '🚀 ~ file: auth.middleware.js:28 ~ AuthenticationMiddleware ~ authenticateAccessToken= ~ accessToken:',
          accessToken,
        );

        const decoded = jwt.decode(accessToken);
        req.user = { userId: decoded.userId };
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
      res.status(200).json({
        message: '새로운 액세스 토큰 발급',
        accessToken: newAccessToken,
      });
      req.user = { userId: decodedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장
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
