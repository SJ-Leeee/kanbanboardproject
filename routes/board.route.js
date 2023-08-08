const express = require('express');
const router = express.Router();
const BoardController = require('../controllers/board.controller');
const boardController = new BoardController();
const Authmiddleware = require('../middlewares/auth.middleware');

const authmiddleware = new Authmiddleware();

router.post('/board', authmiddleware.authenticateAccessToken, boardController.createBoard);
router.get('/board/:boardId', boardController.getBoard);
router.patch('/board/:boardId', boardController.updateBoard);
router.delete('/board/:boardId', boardController.deleteBoard);
router.post('/board/:boardId/user', boardController.addUserToBoard);

module.exports = router;
