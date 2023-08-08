const express = require('express');
const router = express.Router();

const AuthenticationMiddleware = require('../middlewares/auth.middleware');
auth = new AuthenticationMiddleware();

const ColumnController = require('../controllers/column.controller');
const columnController = new ColumnController();

// 컬럼 생성 실행
router.post('/c/:boardId', auth.authenticateAccessToken, columnController.createColumn);
// 컬럼 조회 실행
router.get('/c/:boardId', columnController.getColumn);
// 컬럼 수정
router.put('/c/:boardId/:columnId', auth.authenticateAccessToken, columnController.updateColumn);
// 컬럼 삭제
router.delete('/c/:boardId/:columnId', auth.authenticateAccessToken, columnController.deleteColumn);

module.exports = router;
