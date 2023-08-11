const CardsRepository = require('../repositories/card.repository');
const { CustomError } = require('../_utills/customClass');
class CardsService {
  cardsRepository = new CardsRepository();

  // 카드생성
  createCard = async ({ userId, columnId, assignee, cardDesc, cardName, dueDate, cardColor }) => {
    const card = await this.cardsRepository.createCard({
      userId,
      columnId,
      assignee,
      cardName,
      cardDesc,
      cardColor,
      dueDate,
    });
    if (!userId) throw new CustomError('카드생성 실패', 400);
    return { code: 200, data: card };
  };

  // 카드 조회
  getCard = async (columnId) => {
    const data = await this.cardsRepository.getCard(columnId);

    return { code: 200, data };
  };

  // 카드 마감일 설정
  updateCardDueDate = async ({ cardId, dueDate }) => {
    const card = await this.cardsRepository.updateCardDueDate({ cardId, dueDate });
    if (!card) throw new CustomError('dueDate업데이트 실패', 404);
    return { code: 200, data: card };
  };
}
module.exports = CardsService;
