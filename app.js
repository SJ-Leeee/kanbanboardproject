const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const {} = require('./routes');

app.use(express.json());
app.use(cookieParser());
app.use('/api', [, , , ,]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
