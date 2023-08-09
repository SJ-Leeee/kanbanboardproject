const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const textLogo = document.querySelector('.text-logo');

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId: id, password }),
      });

      if (response.ok) {
        // 로그인이 성공했을 때 처리
        const data = await response.json();
        const accessToken = data.accessToken;
        if (localStorage.getItem('accessToken')) {
          localStorage.removeItem('accessToken');
        }

        // 로컬 스토리지에 accessToken 저장
        localStorage.setItem('accessToken', accessToken);

        // 로그인 후 이동할 페이지로 리다이렉트 등의 동작 수행
        window.location.href = '/html/mypage.html'; // 이동할 페이지 URL
      } else {
        // 로그인이 실패했을 때 처리
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
});
// 임시 로그인 함수, accesstoken 로컬스토리지에 저장했습니다.
