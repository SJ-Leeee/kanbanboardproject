const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const columnRouter = require('./routes/column.route.js');
const boardRoute = require('./routes/board.route');

app.use(express.json());
app.use(cookieParser());

// 기본 메인페이지 프론트 연결 확인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

app.use('/api', [boardRoute, columnRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
