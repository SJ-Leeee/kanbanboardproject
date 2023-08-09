const { Boards, Lists, Cards, Comments, Columns } = require('./models');
const faker = require('faker');

const generateData = async () => {
  // 더미 보드 5개 생성
  for (let i = 0; i < 5; i++) {
    const newBoard = await Boards.create({
      title: faker.company.catchPhrase(),
    });

    // 각 보드에 대해 더미 리스트 3개 생성
    for (let j = 0; j < 3; j++) {
      const newList = await Lists.create({
        title: faker.hacker.phrase(),
        boardId: newBoard.id,
      });

      // 각 리스트에 대해 더미 카드 5개 생성
      for (let k = 0; k < 5; k++) {
        const dueDate = faker.date.between(new Date(), new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000));
        const newCard = await Cards.create({
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          dueDate: dueDate,
          listId: newList.id,
        });

        // 각 카드에 대해 더미 댓글 3개 생성
        for (let l = 0; l < 3; l++) {
          await Comments.create({
            content: faker.lorem.sentences(),
            cardId: newCard.id,
          });
        }
      }
    }
  }
};

generateData()
  .then(() => {
    console.log('더미 데이터 생성 완료');
  })
  .catch((err) => {
    console.error(err);
  });
