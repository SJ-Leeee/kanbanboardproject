const CardsService = require('../services/card.service');
class CardController {
  cardsService = new CardsService();
  dueDates = new Map(); // 전역변수 Map객체 생성
  // 카드생성
  createCard = async (req, res) => {
    try {
      const { userId } = req.user;
      const { columnId } = req.params;

      const { cardName, cardDesc, cardColor, assignee } = req.body;

      if (!columnId) {
        return res.status(400).json({ message: 'columnId가 존재하지않습니다.' });
      }
      // dueDates Map에서 userId의 dueDate를 가져오고 없으면 null
      const userDueDate = this.dueDates.has(userId) ? this.dueDates.get(userId) : null;

      const { code, data } = await this.cardsService.createCard({
        userId,
        columnId,
        assignee,
        cardName,
        cardDesc,
        cardColor,
        dueDate: userDueDate,
      });

      return res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '오류' });
    }
  };

  // 카드 마감일 설정 / 수정
  updateCardDueDate = async (req, res) => {
    try {
      const { cardId } = req.params;
      const { dueDate } = req.body;
      const { userId } = req.user;

      if (!cardId) return res.status(400).json({ message: '카드ID가 필요합니다.' });
      if (!dueDate) return res.status(400).json({ message: '마감일을 설정해주세요!' });

      const { code, data } = await this.cardsService.updateCardDueDate({ cardId, dueDate });
      // 성공적으로 되면 user의 dueDate 삭제(다음 카드등록할때 null값 줄려고)
      if (code === 200) {
        this.dueDates.delete(userId);
      }

      return res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '오류발생' });
    }
  };
}
module.exports = CardController;
