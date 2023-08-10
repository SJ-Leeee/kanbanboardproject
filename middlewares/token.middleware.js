const AuthenticationMiddleware = require('./auth.middleware'); // auth.middleware.js 파일의 경로에 맞게 수정

const authenticateToken = async (req, res, next) => {
  if (req.headers.cookie) {
    try {
      const authMiddleware = new AuthenticationMiddleware();
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
