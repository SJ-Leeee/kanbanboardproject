/**@카드옮기기_버튼추가 */
/**@카드에_댓글남기기_목록추가 */

document.querySelectorAll('.add-card-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const column = e.target.parentElement;
    createCardForm(column);
  });
});

async function createCardOnServer(cardData) {
  try {
    const response = await fetch('/api/cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateCardOnServer(cardId, cardData) {
  try {
    const response = await fetch(`/api/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function createCardForm(column, isEditMode = false) {
  const card = isEditMode ? column.querySelector('[data-being-edited="true"]') : null;
  const currentCardColor = card ? card.style.backgroundColor : '#000000';
  const currentCardName = card ? card.querySelector('.card-header h3').innerText : '';
  const currentCardDesc = card ? card.querySelector('p').innerText : '';
  const currentUserDueDate = card ? card.querySelector('.card-header span').innerText : '';

  const form = document.createElement('form');
  form.className = 'card-form';
  form.innerHTML = `
    <input type="text" name="card-name" placeholder="카드 이름" required value="${currentCardName}" />
    <textarea name="card-desc" rows="3" placeholder="카드 설명" required>${currentCardDesc}</textarea>
    <input type="color" name="card-color" value="${currentCardColor}" />
    <input type="date" name="due-date" required value="${currentUserDueDate}" />
    <button type="submit">${isEditMode ? '수정' : '저장'}</button>
    <button type="button" class="cancel">취소</button>
  `;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cardName = form.querySelector('[name="card-name"]').value;
    const cardDesc = form.querySelector('[name="card-desc"]').value;
    const cardColor = form.querySelector('[name="card-color"]').value;
    const userDueDate = form.querySelector('[name="due-date"]').value;

    const columnId = column.getAttribute('data-id');

    if (isEditMode) {
      const cardId = card.getAttribute('data-id');
      updateCard(column, cardName, cardDesc, cardColor, userDueDate);
      await updateCardOnServer(cardId, { cardName, cardDesc, cardColor, userDueDate });
    } else {
      createCard(column, cardName, cardDesc, cardColor, userDueDate);
      await createCardOnServer({ columnId, cardName, cardDesc, cardColor, userDueDate });
    }

    form.remove();
  });

  form.querySelector('.cancel').addEventListener('click', () => {
    form.remove();
  });

  column.appendChild(form);
}

function createCard(column, cardName, cardDesc, cardColor, userDueDate) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.backgroundColor = cardColor;
  card.innerHTML = `
    <div class="card-header">
      <h3>${cardName}</h3>
      <span>${userDueDate}</span>
    </div>
    <p>${cardDesc}</p>
    <button class="edit-card-button">수정</button>
    <button class="delete-card-button">삭제</button>
  `;

  const editButton = card.querySelector('.edit-card-button');
  editButton.addEventListener('click', () => {
    if (!column.querySelector('.card-form')) {
      card.setAttribute('data-being-edited', 'true');
      createCardForm(column, true);
    }
  });

  const deleteButton = card.querySelector('.delete-card-button');
  deleteButton.addEventListener('click', () => card.remove());

  column.insertBefore(card, column.querySelector('.add-card-button'));
}

function updateCard(column, cardName, cardDesc, cardColor, userDueDate) {
  const card = column.querySelector('[data-being-edited="true"]');
  if (!card) {
    return;
  }

  card.style.backgroundColor = cardColor;
  card.querySelector('.card-header h3').innerText = cardName;
  card.querySelector('.card-header span').innerText = userDueDate;
  card.querySelector('p').innerText = cardDesc;
  card.removeAttribute('data-being-edited');
}
