// main tag
const board = document.querySelector('.board');
// create-column button tag
const columnBtn = document.querySelector('#columnBtn');

// 컬럼생성 버튼 클릭 시 이벤트리스너 호출
columnBtn.addEventListener('click', async () => {
  const boardId = 21;
  const columnName = prompt('생성할 컬럼명을 입력해주세요.');

  try {
    const createResponse = await fetch(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: {
        authorization:
          'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE2OTE1NzA4MzEsImV4cCI6MTY5MTU3MTczMX0.GiHIRzWu0mn3SQ5fL18LwJCA0M-aSijncyPFoiVKnEA',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnName }),
    });
    await createResponse.json().then((result) => {
      result.errorMessage ? alert(result.errorMessage) : alert(`${columnName}으로 컬럼이 생성되었습니다.`);
    });
  } catch (err) {
    console.log(err.message);
    return alert('컬럼 생성에 실패하였습니다.');
  }

  // 생성할 컬럼 HTML 세팅
  const columnSet = `
                  <div class="column" id="${columnName}-column">
                    <h2 class="column-title">${columnName}</h2>
                    <div class="card">Card 1</div>
                    <div class="card">Card 2</div>
                    <button class="add-card-button">Add Card</button>
                    <button class="delete-column-button">delete</button>
                  </div>
                  `;

  board.insertBefore(document.createRange().createContextualFragment(columnSet), columnBtn);
});

// 컬럼명 변경
// h2태그
const titles = document.querySelectorAll('.column-title');
// 각각의 h2태그에 addEventListener 호출
titles.forEach((title) => {
  title.addEventListener('click', (e) => {
    // 현재 사용중인 제목 변수처리
    const useTitle = title.textContent;
    // 각 제목의 html 형식을 input 태그로 바꿔주고, value 값에 할당 변수 사용
    title.innerHTML = `<input type="text" value="${useTitle}" class="edit-input">`;

    const inputTag = title.querySelector('.edit-input');
    inputTag.focus();
    // 커서위치 맨 뒤로
    inputTag.selectionStart = useTitle.length;

    inputTag.addEventListener('blur', (e) => {
      // console.log(e.target);
      // if (e.target !== inputTag) {
      //   title.innerHTML = `<h2 class="column-title">${useTitle}</h2>`;
      window.location.reload();
      // }
    });

    inputTag.addEventListener('keydown', async (e) => {
      // boardId
      const params = new URLSearchParams(window.location.search);
      const boardId = params.get('boardId');
      // columnId
      const columnId = e.target.parentNode.parentNode.id;

      try {
        if (e.key === 'Enter') {
          const columnName = inputTag.value;

          const changeColumnNameResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
            method: 'PUT',
            headers: {
              authorization:
                'Bearer' +
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE2OTE1NzA4MzEsImV4cCI6MTY5MTU3MTczMX0.GiHIRzWu0mn3SQ5fL18LwJCA0M-aSijncyPFoiVKnEA',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ columnName }),
          });

          await changeColumnNameResponse.json().then((result) => {
            return result.errorMessage ? alert(result.errorMessage) : alert(result.message);
          });
        }
      } catch (err) {
        console.log(err);
        return alert('컬럼명 변경에 실패하였습니다.');
      }
    });
  });
});

// 컬럼 삭제
// 컬럼삭제 버튼태그 가져오고,
const deleteButtons = document.querySelectorAll('.delete-column-button');
deleteButtons.forEach((deleteBtn) => {
  deleteBtn.addEventListener('click', async (e) => {
    // boardId
    const params = new URLSearchParams(window.location.search);
    const boardId = params.get('boardId');
    // columnId
    const columnId = e.target.parentNode.id;

    try {
      const deleteResponse = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
        method: 'DELETE',
        headers: {
          authorization:
            'Bearer' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE2OTE1NjM3MDEsImV4cCI6MTY5MTU2NDYwMX0.dxFgAuhkYxAHKNRTRA0HAbgH_gq0vw4b-Kn8OTDB7ks',
          'Content-Type': 'application/json',
        },
      });
      await deleteResponse.json().then((result) => {
        result.errorMessage ? alert(result.errorMessage) : alert(result.message);
      });
    } catch (err) {
      console.log(err);
      return alert('컬럼 삭제에 실패하였습니다.');
    }
  });
});
