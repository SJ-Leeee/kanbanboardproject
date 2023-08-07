const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const boardRoute = require('./routes/board.route');

app.use(express.json());
app.use(cookieParser());
app.use('/api', [boardRoute]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
