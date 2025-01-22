// public/add-to-my-collection-modal.js
const addToMyCollectionModal = document.getElementById('add-to-my-collection-modal');
const addToMyCollectionModalContent = document.getElementById('add-to-my-collection-modal-content');
const addToMyCollectionModalCloseBtn = document.getElementById('add-to-my-collection-modal-close-btn');

document.querySelectorAll('.add-to-my-collection-btn').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const recipeId = event.target.getAttribute('data-id');
    try {
      const response = await fetch('/api/my-collections?userId=' + localStorage.getItem('id'));
      if (response.ok) {
        const myCollections = await response.json();
        addToMyCollectionModalContent.innerHTML = myCollections.map((myCollection) => {
          return `
            <button id="add-to-my-collection-btn" data-id="${myCollection.id}">${myCollection.collectionGroupName}</button>
          `;
        }).join('');
        addToMyCollectionModal.style.display = 'block';
      } else {
        alert('Failed to fetch my collections');
      }
    } catch (error) {
      alert(`Failed to fetch my collections: ${error.message}`);
    }
  });
});

addToMyCollectionModalCloseBtn.addEventListener('click', () => {
  addToMyCollectionModal.style.display = 'none';
});

document.addEventListener('click', (event) => {
  if (event.target === addToMyCollectionModal) {
    addToMyCollectionModal.style.display = 'none';
  }
});

document.querySelectorAll('#add-to-my-collection-btn').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const collectionId = event.target.getAttribute('data-id');
    const recipeId = event.target.parentNode.getAttribute('data-recipe-id');
    try {
      const response = await fetch('/api/my-collections/add-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId, recipeId }),
      });
      if (response.ok) {
        addToMyCollectionModal.style.display = 'none';
      } else {
        alert('Failed to add recipe to my collection');
      }
    } catch (error) {
      alert(`Failed to add recipe to my collection: ${error.message}`);
    }
  });
});