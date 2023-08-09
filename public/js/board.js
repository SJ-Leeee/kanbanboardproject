// 더미 데이터로 사용할 카드 정보
const dummyCards = [
  { id: 1, title: 'Task 1' },
  { id: 2, title: 'Task 2' },
];

// DOM 요소들을 선택합니다.
const board = document.querySelector('.board');
const addColumnButton = document.querySelector('.add-column-button');

// 각 컬럼에 더미 데이터의 카드를 추가하는 함수
const addCardsToColumns = () => {
  const columns = board.querySelectorAll('.column');

  columns.forEach((column) => {
    // 더미 데이터의 카드를 생성하여 컬럼에 추가합니다.
    dummyCards.forEach((card) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.textContent = card.title;
      column.appendChild(cardElement);
    });

    // 컬럼에 카드를 추가하는 버튼을 생성하여 컬럼에 추가합니다.
    const addCardButton = document.createElement('button');
    addCardButton.classList.add('add-card-button');
    addCardButton.textContent = 'Add Card';
    column.appendChild(addCardButton);

    // 카드 추가 버튼에 이벤트 리스너를 등록합니다.
    addCardButton.addEventListener('click', () => {
      const cardTitle = prompt('Enter card title:');
      if (cardTitle) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = cardTitle;
        column.insertBefore(cardElement, addCardButton);
      }
    });
  });
};

// 컬럼 추가 버튼에 이벤트 리스너를 등록합니다.
addColumnButton.addEventListener('click', () => {
  const newColumn = document.createElement('div');
  newColumn.classList.add('column');
  board.insertBefore(newColumn, addColumnButton);
  addCardsToColumns();
});

// 초기 실행시 더미 데이터의 카드를 추가합니다.
addCardsToColumns();
