// function getCookieValue(cookieName) {
//   const cookies = document.cookie;
//   const cookieArray = cookies.split(';');

//   for (const cookie of cookieArray) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === cookieName) {
//       return value;
//     }
//   }
//   return null;
// }

// const accessToken = getCookieValue('access_token');

document.querySelector('.add-card-button').addEventListener('click', async () => {
  console.log('hi');
  const columnId = `${columnId}`; // 해당 columnId를 가져오기
  const cardName = document.getElementById('card-name-input').value;
  const cardDesc = document.getElementById('card-description-input').value;
  const cardColor = document.getElementById('card-color-input').value;
  const assignee = document.getElementById('assignee-input').value;
  const accessToken = getCookieValue('access_token');

  await addCard(columnId, cardName, cardDesc, cardColor, assignee, accessToken);
});

async function addCard(columnId, cardName, cardDesc, cardColor, assignee, accessToken) {
  try {
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
  } catch (error) {
    console.error('오류 발생:', error);
  }
}
