const AuthenticationMiddleware = require('./auth.middleware');

const authenticateToken = async (req, res, next) => {
  if (req.headers.cookie) {
    try {
      console.log('main.html 진입');
      const authMiddleware = new AuthenticationMiddleware();

      const refreshToken = await authMiddleware.getRefreshToken(req.headers.cookie);

      if (!refreshToken) {
        // 리프레시 토큰이 없을 때의 동작을 수행
        console.log('리프레시 토큰이 없습니다.');
        return next(); // 다음 미들웨어로 이동
      }

      authMiddleware.authenticateAccessToken(req, res, () => {
        // 액세스 토큰 검증에 성공한 경우, 마이페이지로 리다이렉트
        return res.redirect('/html/mypage.html');
      });
    } catch (error) {
      return res.status(401).json({ message: '액세스 토큰 오류' });
    }
  } else {
    next();
  }
};

module.exports = authenticateToken;
