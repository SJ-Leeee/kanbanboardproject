const myBoardList = document.querySelector('#myBoards');
const invitedBoardList = document.querySelector('#invitedBoards');

document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('accessToken');
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

function redirectToAuthPage() {
  window.location.href = '/html/auth.html'; // auth.html 페이지로 이동
}

function redirectToBoardPage(boardId) {
  window.location.href = `/html/board.html?boardId=${boardId}`; // 해당 Board 페이지로 이동
}

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

function openModal(boardId, event) {
  // 모달창 요소 가져오기
  event.stopPropagation();
  const modal = document.getElementById('myModal');
  const headUserSpan = document.getElementById('headUserSpan');
  const invitedUsersSpan = document.getElementById('invitedUsersSpan');
  const createdAtSpan = document.getElementById('createdAtSpan');
  const editButton = document.getElementById('editButton');
  const deleteButton = document.getElementById('deleteButton');

  // 여기에서 boardId를 사용하여 필요한 정보를 가져오고 설정합니다.
  // 더미 데이터를 사용한 예시
  const dummyData = {
    headUser: 'John Doe',
    invitedUsers: ['Alice', 'Bob', 'Charlie'],
    createdAt: '2023-07-21',
  };

  // 모달 내용 설정
  headUserSpan.textContent = dummyData.headUser;
  invitedUsersSpan.textContent = dummyData.invitedUsers.join(', ');
  createdAtSpan.textContent = dummyData.createdAt;

  // 모달창 열기
  modal.style.display = 'block';

  // 수정 버튼 클릭 시 동작
  editButton.onclick = function () {
    // 수정 버튼 클릭 시 동작을 여기에 추가
    // 예: 수정하는 폼을 보여주거나 다른 동작을 수행
  };

  // 삭제 버튼 클릭 시 동작
  deleteButton.onclick = function () {
    // 삭제 버튼 클릭 시 동작을 여기에 추가
    // 예: 삭제 확인 팝업 띄우기 등
  };
}

// 모달창 닫기
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}
