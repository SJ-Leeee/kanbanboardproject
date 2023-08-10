const myBoardList = document.querySelector('#myBoards');
const invitedBoardList = document.querySelector('#invitedBoards');
const addBoardBtn = document.querySelector('#addBoardButton');
const inviteUserModal = document.getElementById('inviteUserModal');
const availableUsersList = document.getElementById('availableUsersList');
const invitedUsersList = document.getElementById('invitedUsersList');

inviteUserToBoard.addEventListener('click', async (event) => {
  const parentElement = event.target.parentNode;
  const boardId = parentElement.querySelector('#boardNameSpan').getAttribute('data-board-id');
  await openInviteUserModal(boardId);
});

async function openInviteUserModal(boardId) {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      renderAvailableUsers(data.data);
    } else {
      const responseData = await response.json();
      alert(responseData.err);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
  try {
    const response = await fetch(`/api/board/${boardId}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      renderInvitedUsers(data.data);
      inviteUserModal.style.display = 'block';
    } else {
      const responseData = await response.json();
      alert(responseData.err);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

function renderAvailableUsers(users) {
  availableUsersList.innerHTML = ''; // 목록 초기화
  users.forEach((user) => {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.innerHTML = `
      <span>${user.userName}</span>
      <button class="invite-button" onclick="inviteUser(${user.id}, ${user.userName})">+</button>
    `;
    availableUsersList.appendChild(userItem);
  });
}

function renderInvitedUsers(users) {
  console.log(users);
  invitedUsersList.innerHTML = ''; // 목록 초기화
  users.forEach((user) => {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.innerHTML = `
      <span>${user.User.userName}</span>
      <button class="invite-button" onclick="removeInvitedUser(${user.User.id}, ${user.User.userName})">-</button>
    `;
    invitedUsersList.appendChild(userItem);
  });
}

async function inviteUser(userId, userName) {
  const invitedUserItem = document.createElement('div');
  invitedUserItem.className = 'invited-user';
  invitedUserItem.setAttribute('data-user-id', userId);
  invitedUserItem.innerHTML = `
    <span>${userName}</span>
    <button class="remove-button" onclick="removeInvitedUser('${userId}')">-</button>
  `;
  invitedUsersList.appendChild(invitedUserItem);
}

function removeInvitedUser(userId) {
  const userToRemove = invitedUsersList.querySelector(`.invited-user[data-user-id="${userId}"]`);
  if (userToRemove) {
    invitedUsersList.removeChild(userToRemove);
  }
}

function closeInviteUserModal() {
  inviteUserModal.style.display = 'none';
  availableUsersList.innerHTML = '';
  invitedUsersList.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/boards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      renderBoards(data);
    } else {
      const responseData = await response.json();
      window.location.href = '/';
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});
addBoardBtn.addEventListener('click', async () => {
  const addBoardModal = document.querySelector('#addBoardModal');
  const close = document.querySelector('#close');
  const addBoardNameInput = document.querySelector('#addBoardNameInput');
  const addBoardDescInput = document.querySelector('#addBoardDescInput');
  const addBoardColorSelect = document.querySelector('#addBoardColorSelect');
  const addButton = document.querySelector('#addButton');
  const cancleButton = document.querySelector('#cancleButton');
  console.log(accessToken);

  addBoardModal.style.display = 'block';

  close.onclick = function () {
    addBoardModal.style.display = 'none';
  };

  cancleButton.onclick = function () {
    addBoardModal.style.display = 'none';
  };

  addButton.onclick = async function () {
    try {
      const response = await fetch(`/api/board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardName: addBoardNameInput.value,
          boardDesc: addBoardDescInput.value,
          boardColor: addBoardColorSelect.value,
        }),
      });
      if (response.ok) {
        data = await response.json();
        alert(data.message);
        location.reload();
      } else {
        const responseData = await response.json();
        alert(responseData.err);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
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
async function openModal(boardId, event) {
  // 모달창 요소 가져오기
  event.stopPropagation();
  const modal = document.getElementById('myModal');
  const boardNameSpan = document.getElementById('boardNameSpan');
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
  const inviteUserToBoard = document.getElementById('inviteUserToBoard');

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

  boardNameSpan.setAttribute('data-board-id', boardData.id);
  boardNameSpan.textContent = boardData.boardName;
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
          },
        });
        if (response.ok) {
          alert('삭제가 완료되었습니다.');
          location.reload();
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
        },
        body: JSON.stringify({
          boardName: boardNameInput.value,
          boardDesc: boardDescInput.value,
          boardColor: boardColorSelect.value,
        }),
      });
      if (response.ok) {
        alert('수정이 완료되었습니다.');
        location.reload();
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
