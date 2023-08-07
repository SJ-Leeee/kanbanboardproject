const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const columnRouter = require('./routes/column.route.js');
const boardRoute = require('./routes/board.route');
const redis = require('redis');

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
app.use('/api', [authRouter, boardRoute,columnRouter]);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
