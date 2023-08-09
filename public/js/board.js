// main tag
const board = document.querySelector('.board');
// create-column button tag
const columnBtn = document.querySelector('#columnBtn');

// 컬럼 조회
document.addEventListener('DOMContentLoaded', async (e) => {
  // boardId
  const params = new URLSearchParams(window.location.search);
  const boardId = params.get('boardId');
  // accessToken
  const accessToken = localStorage.getItem('accessToken');
  // 컬럼조회 API fetch
  try {
    const getColumnResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    // fetch로 받아온 data 가공
    await getColumnResponse.json().then((result) => {
      result.data.forEach((data) => {
        // HTML 세팅
        const columnSet = `
                          <div class="column" id="${data.id}">
                            <h2 class="column-title">${data.columnName}</h2>
                            <div class="card">Card 1</div>
                            <div class="card">Card 2</div>
                            <button class="add-card-button">Add Card</button>
                            <button class="delete-column-button">delete</button>
                          </div>
                          `;
        // 화면에 HTML 띄우기
        board.insertBefore(document.createRange().createContextualFragment(columnSet), columnBtn);
      });
      // 오류 출력
      if (result.errorMessage) {
        return alert(result.errorMessage);
      }
    });

    // 컬럼 삭제
    const deleteButtons = document.querySelectorAll('.delete-column-button');
    deleteButtons.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', async (e) => {
        // columnId
        const columnId = e.target.parentNode.id;
        // accessToken
        const accessToken = localStorage.getItem('accessToken');
        // 컬럼삭제 API fetch
        const deleteResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${accessToken}`,
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

        inputTag.addEventListener('keydown', async (e) => {
          // columnId
          const columnId = e.target.parentNode.parentNode.id;
          // accessToken
          const accessToken = localStorage.getItem('accessToken');
          // 컬럼명 변경 API fetch

          if (e.key === 'Enter') {
            const columnName = inputTag.value;

            const changeColumnNameResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
              method: 'PUT',
              headers: {
                authorization: `Bearer ${accessToken}`,
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

// 컬럼 생성
columnBtn.addEventListener('click', async () => {
  // boardId
  const params = new URLSearchParams(window.location.search);
  const boardId = params.get('boardId');
  // accessToken
  const accessToken = localStorage.getItem('accessToken');
  // 생성 columnName
  const columnName = prompt('생성할 컬럼명을 입력해주세요.');
  // 컬럼생성 API fetch
  try {
    const createResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnName }),
    });
    // fetch로 받아온 data 가공
    await createResponse.json().then((result) => {
      // HTML 세팅
      const columnSet = `
                        <div class="column" id="${result.data.id}">
                          <h2 class="column-title">${result.data.columnName}</h2>
                          <div class="card">Card 1</div>
                          <div class="card">Card 2</div>
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
