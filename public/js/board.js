// main tag
const board = document.querySelector('.board');
// create-column button tag
const columnBtn = document.querySelector('#columnBtn');
// boardId
const params = new URLSearchParams(window.location.search);
const boardId = params.get('boardId');
// accessToken
function getCookieValue(cookieName) {
  const cookies = document.cookie;
  const cookieArray = cookies.split(';');

  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) return value;
  }
  return null;
}
const accessToken = getCookieValue('access_token');

// 컬럼 조회
document.addEventListener('DOMContentLoaded', async (e) => {
  // 컬럼조회 API fetch
  try {
    const getColumnResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    // fetch로 받아온 data 가공
    await getColumnResponse.json().then((result) => {
      result.data.forEach((data) => {
        // HTML 세팅
        const columnSet = `
                          <div class="column" draggable="true" id="${data.id}">
                            <h2 class="column-title">${data.columnName}</h2>
                            <div class="card">Card 1</div>
                           
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
    document.querySelector('.add-card-button').addEventListener('click', async (e) => {
      console.log(e.target.parentNode.id);
      const columnId = e.target.parentNode.id;
      const cards = document.querySelector('.card');
      console.log(cards);
      cards.innerHTML += `<input type="text" value="hi" class="card-name-input">`;
      const cardName = document.querySelector('.card-name-input').value;
      console.log(cardName);
      const cardDesc = document.querySelector('.card-description-input').value;
      const cardColor = document.querySelector('.card-color-input').value;
      const assignee = document.querySelector('.assignee-input').value;
      // const accessToken = getCookieValue('access_token').value;

      await addCard(columnId, cardName, cardDesc, cardColor, assignee, accessToken);
    });

    async function addCard(columnId, cardName, cardDesc, cardColor, assignee, accessToken) {
      if (!accessToken) {
        throw new Error('액세스 토큰 없습니다. 로그인이 필요합니다.');
      }

      const response = await fetch(`/api/card/${columnId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          cardName,
          cardDesc,
          cardColor,
          assignee,
        }),
      });

      if (response.ok) {
        const cardData = await response.json();
        console.log('Card added successfully:', cardData.data);
        // 카드 추가가 완료되면 해당 카드를 프론트엔드에 표시하는 코드 추가
      } else {
        const errorMessage = await response.text();
        console.error('Error card:', errorMessage);
        alert(errorMessage.err);
      }
    }
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
            Authorization: `Bearer ${accessToken}`,
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
                Authorization: `Bearer ${accessToken}`,
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
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnName }),
    });
    // fetch로 받아온 data 가공
    await createResponse.json().then((result) => {
      // HTML 세팅
      const columnSet = `
                        <div class="column" draggable="true" id="${result.data.id}">
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
