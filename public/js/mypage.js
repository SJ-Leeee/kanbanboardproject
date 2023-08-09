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
        <div class="board-box" onclick="redirectToBoardPage(${board.Board.id})">${board.Board.boardName}</div>
        `;
    temp_html_v2 += temp;
  });
  myBoards.map((board) => {
    let temp = `
        <div class="board-box" onclick="redirectToBoardPage(${board.id})">${board.boardName}</div>
        `;
    temp_html += temp;
  });
  myBoardList.insertAdjacentHTML('beforeend', temp_html);
  invitedBoardList.insertAdjacentHTML('beforeend', temp_html_v2);
}
// html 삽입
