// public/myCollection.js
const createMyCollectionForm = document.getElementById('create-my-collection-form');
const createMyCollectionInput = document.getElementById('create-my-collection-input');
const myCollectionsContainer = document.getElementById('my-collections-container');

createMyCollectionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const collectionGroupName = createMyCollectionInput.value.trim();
  if (collectionGroupName !== '') {
    try {
      const response = await fetch('/api/my-collections', {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionGroupName, userId: localStorage.getItem('id') }),
      });
      if (response.ok) {
        const myCollection = await response.json();
        renderMyCollections([myCollection]);
      } else {
        alert('Failed to create my collection');
      }
    } catch (error) {
      alert(`Failed to create my collection: ${error.message}`);
    }
  } else {
    alert('Please enter a collection group name');
  }
});

const renderMyCollections = (myCollections) => {
    const addedCollectionGroupNames = new Set();
    myCollectionsContainer.innerHTML = myCollections.map((myCollection) => {
      if (!addedCollectionGroupNames.has(myCollection.collectionGroupName)) {
        addedCollectionGroupNames.add(myCollection.collectionGroupName);
        return `
          <button id="my-collection-btn" data-id="${myCollection.id}" data-collectionGroupName = ${myCollection.collectionGroupName} data-userId = ${myCollection.userId}>${myCollection.collectionGroupName}</button>
        `;
      }
    }).join('');
    myCollectionsContainer.addEventListener('click', async (event) => {
        if (event.target.id === 'my-collection-btn') {
          const groupName = event.target.getAttribute('data-collectionGroupName');
          const userId = event.target.getAttribute('data-userId');
          const collectionId = event.target.getAttribute('data-id');
          try {
            const response = await fetch(`/api/my-collections/${userId}/${groupName}/recipes`);
            if (response.ok) {
              const recipes = await response.json();
              console.log(recipes)
              const groupHeading = document.getElementById('groupHeading');
                groupHeading.innerHTML = `<h3>${groupName}</h3>`;
              const renderedRecipesContainer = document.getElementById('renderedRecipes-container');
              renderedRecipesContainer.innerHTML = recipes.map(recipe => {
                return `
                  <div class="recipe" data-id="${recipe.id}">
                    <h2>${recipe.title}</h2>
                    <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
                    <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
                    <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
                    <h4><strong>Posted By:</strong>${recipe.name}<h4>
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <button class="remove-from-collection-btn" data-id="${recipe.id}">Remove from collection</button>
                  </div>
                `;
              }).join('');

              renderedRecipesContainer.addEventListener('click', async (event) => {
                if (event.target.classList.contains('remove-from-collection-btn')) {
                  const recipeId = event.target.getAttribute('data-id');
                  try {
                    const response = await fetch(`/api/my-collections/remove-recipe/${groupName}/${recipeId}`, {
                      method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    });
                    if (response.ok) {
                      event.target.parentNode.remove();
                      
                    } else {
                      alert('Failed to remove recipe from collection');
                    }
                  } catch (error) {
                    alert(`Failed to remove recipe from collection: ${error.message}`);
                  }
                }
              });
              
            } else {
              alert('Failed to fetch recipes');
            }
          } catch (error) {
            alert(`Failed to fetch recipes: ${error.message}`);
          }

        }
        
    });
    

};



document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/my-collections?userId=' + localStorage.getItem('id'));
    if (response.ok) {
      const myCollections = await response.json();
      renderMyCollections(myCollections);
    } else {
      alert('Failed to fetch my collections');
    }
  } catch (error) {
    alert(`Failed to fetch my collections: ${error.message}`);
  }
});