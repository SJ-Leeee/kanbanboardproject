const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const commentsRouter = require('./routes/card_detail.route');
const cardsRouter = require('./routes/card.route');
const authRouter = require('./routes/auth.route');
const columnRouter = require('./routes/column.route.js');
const boardRoute = require('./routes/board.route');
const redis = require('redis');
const authenticateToken = require('./middlewares/token.middleware');

// Redis 클라이언트 초기화
const redisClient = redis.createClient();

// Redis 연결 상태 확인
redisClient.on('connect', () => {
  console.log('Redis connected');
});

// Redis 오류 처리
redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

app.use(express.json());
app.use(cookieParser());

app.use('/api', [authRouter, boardRoute, columnRouter, commentsRouter, cardsRouter]);

app.use(express.static(path.join(__dirname, 'public')));

// 기본 메인페이지 프론트 연결 확인
app.get('/', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
