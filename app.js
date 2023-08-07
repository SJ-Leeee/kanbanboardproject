const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const columnRouter = require('./routes/column.route.js');

app.use(express.json());
app.use(cookieParser());
app.use('/', [columnRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
