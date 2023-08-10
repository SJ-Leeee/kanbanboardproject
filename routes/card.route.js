const express = require('express');
const router = express.Router();
const CardController = require('../controllers/card.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const cardController = new CardController();
const authMiddleware = new AuthenticationMiddleware();

// 카드생성
router.post('/cards/:columnId', authMiddleware.authenticateAccessToken, cardController.createCard);

// 카드 조회
router.get('/cards/:columnId', authMiddleware.authenticateAccessToken, cardController.getCard);

// 카드 마감일 업데이트 (생성 / 수정 가능)
router.put('/cards/:cardId', authMiddleware.authenticateAccessToken, cardController.updateCardDueDate);

module.exports = router;
