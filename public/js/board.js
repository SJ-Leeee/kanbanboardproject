// board.js

// main tag
const board = document.querySelector('.board');
// create-column button tag
const columnBtn = document.querySelector('#columnBtn');
// boardId
const params = new URLSearchParams(window.location.search);
const boardId = params.get('boardId');

// 보드의 제목 설명을 넣는 부분입니다. 시호님이 보내주신 accesstoken 값이 없으면 main 페이지로 반환하는 코드는 여기다 넣어두었습니다 (리다이렉트 코드는 한개만 있으면 되서 따로 추가하지 않으셔도 됩니다.)
document.addEventListener('DOMContentLoaded', async () => {
  const headerMiddle = document.querySelector('.header-middle');
  const headerRight = document.querySelector('.header-right');
  try {
    const response = await fetch(`/api/board/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const boardData = data.data;
      let temp_html = `<h1 class="board-name">${boardData.boardName}</h1>`;
      let temp_html_v2 = `<p class="board-desc">${boardData.boardDesc}</p>`;
      headerMiddle.innerHTML = temp_html;
      headerRight.innerHTML = temp_html_v2;
    } else {
      const data = await response.json();
      if (data.message === '액세스 토큰 오류') {
        alert('로그인이 필요한 기능입니다.');
        window.location.href = '/';
      } else if (data.message === '리프레시 토큰 만료') {
        alert('로그인이 필요한 기능입니다.');
        window.location.href = '/';
      } else if (data.message === '리프레시 토큰 오류') {
        alert('로그인이 필요한 기능입니다.');
        window.location.href = '/';
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// 컬럼 조회
document.addEventListener('DOMContentLoaded', async (e) => {
  // 컬럼조회 API fetch
  try {
    const getColumnResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // fetch로 받아온 data 제이슨화
    const getColumnData = await getColumnResponse.json();
    if (getColumnData.message) return alert(getColumnData.message);
    // 가공한 데이터 location의 내림차순으로 정렬해서 할당
    const descColumn = getColumnData.data.sort((a, b) => {
      a.location - b.location;
    });
    // 정렬데이터 가공
    descColumn.forEach((data) => {
      // HTML 세팅
      const columnSet = `
                        <div class="column" draggable="true" id="${data.id}">
                          <h2 class="column-title" id="${data.location}">${data.columnName}</h2>
                          <div class="card">Card 1</div>
                          <button id="cardBtn">카드 조회</button>
                          <button class="add-card-button">Add Card</button>
                          <button class="delete-column-button">delete</button>
                        </div>
                        `;
      // 화면에 HTML 띄우기
      board.insertBefore(document.createRange().createContextualFragment(columnSet), columnBtn);
    });
    // 응답 출력
    if (getColumnData.errorMessage) alert(getColumnData.errorMessage);
    // 카드 조회
    document.querySelector('#cardBtn').addEventListener('click', async (e) => {
      const columnId = e.target.parentNode.id;
      const getCardsData = await fetch(`/api/cards/${columnId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await getCardsData.json().then((result) => {
        result.data.forEach((a) => {
          document.querySelector('.card-list').innerHTML = `
                                                            <h2>${a.cardName}</h2>
                                                            <p>${a.cardDesc}</p>
                                                            <p>${a.cardColor}</p>
                                                            <p>${a.dueDate}</p>
                                                            <button class="add-comment-button">댓글추가</button>
                                                            </div>
                                                            `;
        });
        result.errorMessage ? alert('오류') : alert('조회 성공');
      });
    });
    // 드래그 앤 드랍
    const columns = document.querySelectorAll('.column');
    columns.forEach((column) => {
      column.addEventListener('dragstart', (e) => {
        column.classList.add('dragging');
        e.dataTransfer.setData('text/plain', column.id);
      });
      column.addEventListener('dragend', async (e) => {
        column.classList.remove('dragging');
      });
    });
    board.addEventListener('dragover', (e) => {
      e.preventDefault();
      const drag = document.querySelector('.dragging');
      board.appendChild(drag);
    });
    // 카드 생성
    const addCardBtnTag = document.querySelectorAll('.add-card-button');
    addCardBtnTag.forEach((addCardBtn) => {
      addCardBtn.addEventListener('click', async (e) => {
        // columnsId
        const columnId = e.target.parentNode.id;
        const cardNeed = document.querySelector('.card');
        cardNeed.innerHTML = `<div class="card-list">
                              <input type="text" value="Card Example" class="card-name-input">
                              <input type="text" value="카드 예시 입니다." class="card-description-input">
                              <input type="text" value="핑꾸핑꾸 핫핑쿠쨩" class="card-color-input">
                              <input type="text" value="1" class="assignee-input">
                              </div>
                             `;
        // card needs
        const cardName = document.querySelector('.card-name-input').value;
        const cardDesc = document.querySelector('.card-description-input').value;
        const cardColor = document.querySelector('.card-color-input').value;
        const assignee = document.querySelector('.assignee-input').value;
        // addCard 함수호출
        await addCard(columnId, cardName, cardDesc, cardColor, assignee);
      });
      // create card fetch
      async function addCard(columnId, cardName, cardDesc, cardColor, assignee) {
        const response = await fetch(`/api/cards/${columnId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardName,
            cardDesc,
            cardColor,
            assignee,
          }),
        });
        const cardCreateData = await response.json();
        cardCreateData.errorMessage ? alert(cardCreateData.errorMessage) : alert(cardCreateData.message);
      }
      // create card fetch
      async function addCard(columnId, cardName, cardDesc, cardColor, assignee) {
        const response = await fetch(`/api/cards/${columnId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardName,
            cardDesc,
            cardColor,
            assignee,
          }),
        });
        const cardCreateData = await response.json();
        cardCreateData.errorMessage ? alert(cardCreateData.errorMessage) : alert(cardCreateData.message);
        window.location.reload();
      }
      // 컬럼 삭제
      const deleteButtons = document.querySelectorAll('.delete-column-button');
      deleteButtons.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', async (e) => {
          // columnId
          const columnId = e.target.parentNode.id;
          // 컬럼삭제 API fetch
          const deleteResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          // fetch로 받아온 data 가공
          await deleteResponse.json().then((result) => {
            result.errorMessage ? alert(result.errorMessage) : alert(result.message);
            window.location.reload();
          });
        });
      });
      // 컬럼명 변경
      const h2Tag = document.querySelectorAll('.column-title');
      h2Tag.forEach((title) => {
        title.addEventListener('click', (e) => {
          // 현재 사용중인 제목 변수처리
          const useTitle = title.textContent;
          // 각 제목의 html 형식을 input 태그로 바꿔주고, value 값에 할당 변수 사용
          title.innerHTML = `<input type="text" value="${useTitle}" class="edit-input">`;
          const inputTag = title.querySelector('.edit-input');
          inputTag.focus();
          // 커서위치 맨 뒤로
          inputTag.selectionStart = useTitle.length;
          // 포커스를 벗어날 시 기존 제목으로 변경
          inputTag.addEventListener('blur', (e) => {
            window.location.reload();
          });
          // keydown 이벤트리스너
          inputTag.addEventListener('keydown', async (e) => {
            // columnId
            const columnId = e.target.parentNode.parentNode.id;
            // 컬럼명 변경 API fetch
            if (e.key === 'Enter') {
              const columnName = inputTag.value;
              const changeColumnNameResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ columnName }),
              });
              // fetch로 받아온 data 가공
              await changeColumnNameResponse.json().then((result) => {
                h2Tag.innerHTML = `<h2 class="column-title">${columnName}</h2>`;
                result.errorMessage ? alert(result.errorMessage) : alert(result.message);
                window.location.reload();
              });
            }
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
    return alert('컬럼 조회에 실패하였습니다.');
  }
});

// 컬럼 생성
columnBtn.addEventListener('click', async () => {
  // 생성 columnName
  const columnName = prompt('생성할 컬럼명을 입력해주세요.');
  // 취소버튼 클릭시 alert메시지
  if (columnName === null) {
    return alert('컬럼 생성을 취소하였습니다.');
  }
  // 컬럼생성 API fetch
  try {
    const createResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnName }),
    });
    // fetch로 받아온 data 가공
    await createResponse.json().then((result) => {
      // HTML 세팅
      const columnSet = `
                        <div class="column" draggable="true" id="${result.data.id}">
                          <h2 class="column-title" id="${result.data.location}">${result.data.columnName}</h2>
                          <h2 class="column-title" id="${result.data.location}">${result.data.columnName}</h2>
                          <div class="card">Card 1</div>
                          <button id="cardBtn">카드 조회</button>
                          <button id="cardBtn">카드 조회</button>
                          <button class="add-card-button">Add Card</button>
                          <button class="delete-column-button">delete</button>
                        </div>
                        `;
      // HTML 화면에 띄우기
      board.insertBefore(document.createRange().createContextualFragment(columnSet), columnBtn);
      // 메시지 출력
      result.errorMessage ? alert(result.errorMessage) : alert(result.message);
      window.location.reload();
    });
  } catch (err) {
    console.log(err.message);
    return alert('컬럼 생성에 실패하였습니다.');
  }
});
