const myBoardList = document.querySelector('#myBoards');
const invitedBoardList = document.querySelector('#invitedBoards');
const accessToken = localStorage.getItem('accessToken');

document.addEventListener('DOMContentLoaded', async () => {
  if (!accessToken) {
    alert('로그인 후 이용가능한 기능입니다.');
    window.location.href = '/'; // auth.html 페이지로 이동
  }
  try {
    const response = await fetch('/api/boards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      renderBoards(data);
    } else {
      // 로그인이 실패했을 때 처리
      console.error('Login failed');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

function renderBoards(data) {
  const invitedBoards = data.data.invitedBoards;
  const myBoards = data.data.myBoards;
  let temp_html = '';
  let temp_html_v2 = '';
  invitedBoards.map((board) => {
    let temp = `
        <div class="board-box" onclick="redirectToBoardPage(${board.Board.id})">${board.Board.boardName}
        <span class="custom-icon" onclick="openModal(${board.Board.id},event)">➕</span></div>
        `;
    temp_html_v2 += temp;
  });
  myBoards.map((board) => {
    let temp = `
        <div class="board-box" onclick="redirectToBoardPage(${board.id})">${board.boardName}
        <span class="custom-icon" onclick="openModal(${board.id},event)">➕</span></div>
        `;
    temp_html += temp;
  });
  myBoardList.insertAdjacentHTML('beforeend', temp_html);
  invitedBoardList.insertAdjacentHTML('beforeend', temp_html_v2);
}
// html 삽입

async function openModal(boardId, event) {
  // 모달창 요소 가져오기
  event.stopPropagation();
  const modal = document.getElementById('myModal');
  const headUserSpan = document.getElementById('headUserSpan');
  const invitedUsersSpan = document.getElementById('invitedUsersSpan');
  const createdAtSpan = document.getElementById('createdAtSpan');
  const editButton = document.getElementById('editButton');
  const deleteButton = document.getElementById('deleteButton');
  const editForm = document.getElementById('editForm');
  const boardNameInput = document.getElementById('boardNameInput');
  const boardDescInput = document.getElementById('boardDescInput');
  const boardColorSelect = document.getElementById('boardColorSelect');
  const saveButton = document.getElementById('saveButton');
  const cancelButton = document.getElementById('cancelButton');

  let data;
  try {
    const response = await fetch(`/api/board/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      data = await response.json();
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }

  const boardData = data.data;
  const userNamesArr = boardData.InvitedUsers.map((user) => user.User.userName);

  headUserSpan.textContent = boardData.User.userName;
  invitedUsersSpan.textContent = userNamesArr.join(', ');
  createdAtSpan.textContent = boardData.createdAt;

  // 모달창 열기
  modal.style.display = 'block';

  // 수정 버튼 클릭 시 동작
  editButton.onclick = function () {
    editForm.style.display = 'block';
  };

  // 취소 버튼 클릭 시 동작
  cancelButton.onclick = function () {
    editForm.style.display = 'none';
  };

  // 삭제 버튼 클릭 시 동작
  deleteButton.onclick = async function () {
    const confirmation = confirm('정말 삭제하시겠습니까?');
    if (confirmation) {
      try {
        const response = await fetch(`/api/board/${boardId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          alert('삭제가 완료되었습니다.');
        } else {
          const responseData = await response.json();
          alert(responseData.err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      closeModal();
    }
  };

  // 저장 버튼 클릭 시 동작
  saveButton.onclick = async function () {
    // 수정된 정보 저장 및 처리
    try {
      const response = await fetch(`/api/board/${boardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          boardName: boardNameInput.value,
          boardDesc: boardDescInput.value,
          boardColor: boardColorSelect.value,
        }),
      });
      if (response.ok) {
        alert('수정이 완료되었습니다.');
      } else {
        const responseData = await response.json();
        alert(responseData.err);
      }
    } catch (err) {
      console.log(err);
    }
    editForm.style.display = 'none';
  };
}

// 모달창 닫기
function closeModal() {
  const modal = document.getElementById('myModal');
  const editForm = document.getElementById('editForm');
  editForm.style.display = 'none';
  modal.style.display = 'none';
}

function redirectToAuthPage() {
  window.location.href = '/html/auth.html'; // auth.html 페이지로 이동
}

function redirectToBoardPage(boardId) {
  window.location.href = `/html/board.html?boardId=${boardId}`; // 해당 Board 페이지로 이동
}
