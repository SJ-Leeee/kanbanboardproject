const changeIdBtn = document.getElementById('changeIdBtn');
const changeIdForm = document.getElementById('changeIdForm');

const changeUsernameBtn = document.getElementById('changeUsernameBtn');
const changeUsernameForm = document.getElementById('changeUsernameForm');

const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordForm = document.getElementById('changePasswordForm');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('🚀 ~ file: myinfo.js:24 ~ document.addEventListener ~ response:', response);

    if (response.ok) {
      const data = await response.json();

      const usernamePlaceholder = document.getElementById('usernamePlaceholder');
      usernamePlaceholder.textContent = data.userName;
    } else {
      const data = await response.json();
      if (data.message === '액세스 토큰 오류') {
        alert(data.message);
        window.location.href = '/';
      } else if (data.message === '리프레시 토큰 만료') {
        alert(data.message);
        window.location.href = '/';
      } else if (data.message === '리프레시 토큰 오류') {
        alert(data.message);
        window.location.href = '/';
      } else if (data.message === '리프레시 토큰이 없습니다.') {
        alert(data.message);
        window.location.href = '/';
      }
      alert(data.message);
    }
  } catch (error) {
    console.error('유저 정보 불러오기 실패', error);
  }
});

changeIdBtn.addEventListener('click', () => {
  changeIdForm.style.display = 'block';
  changeIdBtn.style.display = 'none';

  const inputIdButton = document.querySelector('.input-id');

  inputIdButton.addEventListener('click', async () => {
    const inputId = document.getElementById('input-id').value;

    try {
      const response = await fetch('/api/account/loginId', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId: inputId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.reload();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('로그인 아이디 변경 실패', error);
    }
  });
});

changeUsernameBtn.addEventListener('click', () => {
  changeUsernameForm.style.display = 'block';
  changeUsernameBtn.style.display = 'none';

  const inputUsernameButton = document.querySelector('.input-username');

  inputUsernameButton.addEventListener('click', async () => {
    const inputUsername = document.getElementById('input-username').value;

    try {
      const response = await fetch('/api/account/userName/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: inputUsername }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.reload();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('유저 네임 변경 실패', error);
    }
  });
});

changePasswordBtn.addEventListener('click', () => {
  changePasswordForm.style.display = 'block';
  changePasswordBtn.style.display = 'none';

  const inputPasswordButton = document.querySelector('.input-password');

  inputPasswordButton.addEventListener('click', async () => {
    const inputPassword = document.getElementById('input-password').value;
    const inputConfirmPassword = document.getElementById('input-confirmpassword').value;

    try {
      const response = await fetch('/api/account/password/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: inputPassword, confirmpassword: inputConfirmPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.reload();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('비밀번호 변경 실패', error);
    }
  });
});

const logoutBtn = document.querySelector('.logout');

logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      const data = await response.json();
      alert(data.message);
    }
  } catch (error) {
    console.error('로그아웃 실패', error);
  }
});
