const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const commentsRouter = require('./routes/card_detail.route');

app.use(express.json());
app.use(cookieParser());
app.use('/api', [commentsRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
