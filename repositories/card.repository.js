const { Cards } = require('../models');

class CardsRepository {
  createCard = async ({ columnId, assignee, cardName, cardDesc, cardColor, dueDate }) => {
    return await Cards.create({
      columnId: columnId,
      assignee: assignee,
      cardName: cardName,
      cardDesc: cardDesc,
      cardColor: cardColor,
      dueDate: dueDate,
    });
  };

  // 카드 조회
  getCard = async (columnId) => {
    const data = await Cards.findAll({ where: { columnId } });
    return data;
  };

  updateCardDueDate = async ({ cardId, dueDate }) => {
    await Cards.update({ dueDate: dueDate }, { where: { id: cardId } });
    return await Cards.findOne({ where: { id: cardId } });
  };
}

module.exports = CardsRepository;
