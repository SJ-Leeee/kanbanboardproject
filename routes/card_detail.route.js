const express = require('express');
const router = express.Router();
const CardDetailController = require('../controllers/card_detail.controller');

const cardDetailController = new CardDetailController();

/**@댓글생성_API */
router.post('/card/:cardId/comments', cardDetailController.createComment); // --> 추후에 Middleware 넣어야함

/**@댓글조회_API */
router.get('/card/:cardId/comments', cardDetailController.findComment);

/**@댓글수정_API */
router.put('/card/:cardId/comments/:id', cardDetailController.updateComment);

/**@댓글삭제_API */
router.delete('/card/:cardId/comments/:id', cardDetailController.deleteComment);

module.exports = router;
