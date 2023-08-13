const express = require('express');
const router = express.Router();
const BoardController = require('../controllers/board.controller');
const boardController = new BoardController();
const Authmiddleware = require('../middlewares/auth.middleware');
const authmiddleware = new Authmiddleware();

router.post('/board', authmiddleware.authenticateAccessToken, boardController.createBoard); // 1개를 추가하는게
// 자원을 의미
router.get('/board/:boardId', boardController.getBoard);
router.get('/boards', authmiddleware.authenticateAccessToken, boardController.getMyBoards);
router.patch('/board/:boardId', authmiddleware.authenticateAccessToken, boardController.updateBoard);
router.delete('/board/:boardId', authmiddleware.authenticateAccessToken, boardController.deleteBoard);
router.post('/board/:boardId/user', authmiddleware.authenticateAccessToken, boardController.addUserToBoard);
router.delete('/board/:boardId/users', authmiddleware.authenticateAccessToken, boardController.deleteBoard);

// 유저데이터
router.get('/users', boardController.getAllUsers);
// 보드에 추가된 user 조회
router.get('/board/:boardId/user', boardController.getUserInBoard);

module.exports = router;
