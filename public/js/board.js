// board.js

// main tag
const board = document.querySelector('.board');
// create-column button tag
const columnBtn = document.querySelector('#columnBtn');
// boardId
const params = new URLSearchParams(window.location.search);
const commentBtn = document.querySelector('.add-comment-button');
const boardId = params.get('boardId');

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
        window.location.href = '/html/auth.html';
      } else if (data.message === '리프레시 토큰 만료') {
        alert('로그인이 필요한 기능입니다.');
        window.location.href = '/html/auth.html';
      } else if (data.message === '리프레시 토큰 오류') {
        alert('로그인이 필요한 기능입니다.');
        window.location.href = '/html/auth.html';
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
    // 오류 출력
    if (getColumnData.errorMessage) {
      return alert(getColumnData.errorMessage);
    }

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
          //   document.querySelector('.card-list').innerHTML = `<div class="card-list">
          //                                                     <h2>${a.cardName}</h2>
          //                                                     <p>${a.cardDesc}</p>
          //                                                     <p>${a.cardColor}</p>
          //                                                     <p>${a.dueDate}</p>

          //                                                     <button class="add-comment-button">댓글추가</button>
          //                                                     </div>
          //                                                     `;
          // });
          const newCard = `
                          <div class="card" id="${a.id}">
                            <h2>${a.cardName}</h2>
                            <p>${a.cardDesc}</p>
                            <p>${a.cardColor}</p>
                            <p>${a.dueDate}</p>
                            <button class="add-comment-button">댓글추가</button>
                          </div>
                          `;
          const column = document.getElementById(columnId);
          column.insertAdjacentHTML('beforeend', newCard);
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
        cardNeed.innerHTML = `
                              <input type="text" value="Card Example" class="card-name-input">
                              <input type="text" value="카드 예시 입니다." class="card-description-input">
                              <input type="text" value="핑꾸핑꾸 핫핑쿠쨩" class="card-color-input">
                              <input type="text" value="2023-08-30" class="dueDate-input">
                              <input type="text" value="1" class="assignee-input">
                             `;
        // card needs
        const cardName = document.querySelector('.card-name-input').value;
        const cardDesc = document.querySelector('.card-description-input').value;
        const cardColor = document.querySelector('.card-color-input').value;
        const assignee = document.querySelector('.assignee-input').value;
        const dueDate = document.querySelector('.dueDate-input').value;
        // addCard 함수호출
        await addCard(columnId, cardName, cardDesc, cardColor, assignee, dueDate);
      });
      // create card fetch
      async function addCard(columnId, cardName, cardDesc, cardColor, assignee, dueDate) {
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
            dueDate,
          }),
        });
        const cardCreateData = await response.json();
        cardCreateData.errorMessage ? alert(cardCreateData.errorMessage) : alert(cardCreateData.message);

        window.location.reload();
      }
    });

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
  } catch (err) {
    console.log(err);
    return alert('컬럼 조회에 실패하였습니다.');
  }
});
// 수정버튼 생성 함수 정의
function createEditButton() {
  const editButton = document.createElement('button');
  editButton.classList.add('edit-comment-button');
  editButton.textContent = '수정';
  return editButton;
}
// 삭제버튼 생성 함수 정의
function createDeleteButton() {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-comment-button');
  deleteButton.textContent = '삭제';
  return deleteButton;
}
board.addEventListener('click', async (e) => {
  const parentCard = e.target.closest('.card');
  const cardId = parentCard.id;
  // 댓글 추가부분
  if (e.target.classList.contains('add-comment-button')) {
    const commentText = prompt('댓글을 입력해주세요.');

    if (!commentText || commentText.trim() === '') {
      alert('댓글 생성을 취소하였습니다.');
    } else {
      try {
        const createCommentResponse = await fetch(`/api/cards/${cardId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentText }),
        });

        const createCommentData = await createCommentResponse.json();

        if (createCommentData.errorMessage) {
          alert(createCommentData.errorMessage);
        } else {
          alert('댓글이 성공적으로 작성되었습니다.');
          const newComment = document.createElement('div');
          newComment.classList.add('comment');
          // 추가: comment-text를 감싸는 span 요소를 만들고 붙입니다.
          const commentTextElement = document.createElement('span');
          commentTextElement.classList.add('comment-text');
          commentTextElement.textContent = createCommentData.data.commentText;
          newComment.appendChild(commentTextElement);

          const editButton = createEditButton();
          editButton.addEventListener('click', handleEditButtonClick);
          newComment.appendChild(editButton);

          const deleteButton = createDeleteButton();
          deleteButton.addEventListener('click', handleDeleteButtonClick);
          newComment.appendChild(deleteButton);

          parentCard.appendChild(newComment);
        }
      } catch (err) {
        console.log(err);
        return alert('댓글 작성에 실패하였습니다.');
      }
    }
    // 댓글 수정부분
  } else if (e.target.classList.contains('edit-comment-button')) {
    handleEditButtonClick(e, cardId);
  } // 댓글 삭제부분
  else if (e.target.classList.contains('delete-comment-button')) {
    handleDeleteButtonClick(e, cardId);
  }
});
async function handleEditButtonClick(e, cardId) {
  e.stopPropagation();
  const commentElement = e.target.closest('.comment');
  const id = commentElement.dataset.commentId;

  const commentTextElement = commentElement.querySelector('.comment-text');
  const commentText = prompt('댓글을 수정해주세요.', commentTextElement.textContent);

  if (!commentText || commentText.trim() === '') {
    return alert('댓글 수정을 취소하였습니다.');
  }
  // 댓글수정
  try {
    const updateCommentResponse = await fetch(`/api/cards/${cardId}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentText }),
    });
    const updateCommentData = await updateCommentResponse.json();
    if (updateCommentData.errorMessage) {
      alert(updateCommentData.errorMessage);
    } else {
      alert('댓글이 성공적으로 수정되었습니다.');
      commentTextElement.textContent = commentText;
    }
  } catch (err) {
    console.log(err);
    return alert('댓글 수정에 실패하였습니다.');
  }
}
// 댓글삭제
async function handleDeleteButtonClick(e, cardId) {
  e.stopPropagation();
  const commentElement = e.target.closest('.comment');
  const id = commentElement.dataset.commentId;

  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      const deleteCommentResponse = await fetch(`/api/cards/${cardId}/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const deleteCommentData = await deleteCommentResponse.json();
      if (deleteCommentData.errorMessage) {
        alert(deleteCommentData.errorMessage);
      } else {
        alert('댓글이 성공적으로 삭제되었습니다.');
        commentElement.remove();
      }
    } catch (err) {
      console.log(err);
      return alert('댓글 삭제에 실패하였습니다.');
    }
  }
}
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
                          <div class="card">Card 1</div>
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
