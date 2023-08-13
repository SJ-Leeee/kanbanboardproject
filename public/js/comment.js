async function createComment(card, commentText) {
  const cardId = card.getAttribute('data-id');
  const response = await fetch(`/api/cards/${cardId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commentText }),
  });

  if (response.ok) {
    const comment = await response.json();
    appendComment(card.querySelector('.comments-list'), comment);
  } else {
    console.error('Error creating comment:', response);
  }
}

function appendComment(commentList, comment) {
  const listItem = document.createElement('li');
  listItem.textContent = comment.commentText;
  commentList.appendChild(listItem);
}

async function fetchComments(card) {
  const cardId = card.getAttribute('data-id');
  const response = await fetch(`/api/cards/${cardId}/comments`);

  if (response.ok) {
    const comments = await response.json();
    const commentList = card.querySelector('.comments-list');
    commentList.innerHTML = '';
    comments.forEach((comment) => appendComment(commentList, comment));
  } else {
    console.error('Error fetching comments:', response);
  }
}

const commentForm = card.querySelector('.comment-form');

// Add an event listener to the form
commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const commentText = commentForm.querySelector('[name="comment-text"]').value;
  await createComment(card, commentText);
  commentForm.querySelector('[name="comment-text"]').value = '';
});

// Add this line after appending the card to the column (inside the createCard function):
column.insertBefore(card, column.querySelector('.add-card-button'));

// Add the line below:
fetchComments(card);
