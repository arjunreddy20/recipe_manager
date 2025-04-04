const fetchRecipes = async () => {
  const token = localStorage.getItem('token');
  console.log(token);
    const response = await fetch('/api/recipes',{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    currentUser = localStorage.getItem("id");
    const recipes = await response.json();
    //console.log(recipes)
    if (Array.isArray(recipes)) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = recipes.map( recipe => {
      const isSaved = recipe.Collections && recipe.Collections.length > 0;
      return `
        <div class="recipe" data-id="${recipe.id}">
          <h2>${recipe.title}</h2>
          <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
          <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
          <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
          <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
          <h4><strong>Posted By:</strong>${recipe.name}<h4>
          <img src="${recipe.image}" alt="${recipe.title}">
          <p><button type="submit" id="like" data-id= ${recipe.id}>Like</button> =  ${recipe.likes}</p>
          <p><button type="submit" id="follow" data-id= ${recipe.userId} data-name = ${recipe.name}>Follow</button></p>
          <div class="rating">
            <p><strong>Average Rating:</strong> ${(recipe.Reviews && recipe.Reviews.length > 0 ? recipe.Reviews.filter(review => review.rating !== 0).reduce((sum, review) => sum + review.rating, 0) / recipe.Reviews.filter(review => review.rating !== 0).length : 0).toFixed(1)} / 5</p>
            <p><strong>Rate this recipe:</strong></p>
            <div class="stars" data-id="${recipe.id}">
              ${[1, 2, 3, 4, 5].map(star => `
                <span class="star" data-value="${star}">&#9733;</span>
              `).join('')}
            </div>
          </div>
          <p><input type="text" id="comment" placeholder="enter Comment">
          <button type="submit" id="commentBtn">Comment</button></p>
          <p><strong>Reviews:</strong></p>
          <ul>
          ${(recipe.Reviews ? recipe.Reviews.filter(review => review.comment !== null && review.comment !== '').map(review => `<li>${review.User && review.User.name ? review.User.name : 'Unknown'}: ${review.comment}</li>`).join('') : '')}
          </ul>
          <p>${parseInt(currentUser) === parseInt(recipe.userId)?`<button type="submit" id="updateBtn">EDIT</button>` : ""}
          ${parseInt(currentUser) === parseInt(recipe.userId) ? `<button type="submit" id="deleteBtn" data-id="${recipe.id}">DELETE</button>` : ''}
          ${isSaved ? '' : `<button type="submit" id="saveBtn" data-id="${recipe.id}">Save</button>`}
        </div>
      `;
    }).join('');


    document.querySelectorAll('.stars').forEach(stars => {
      stars.addEventListener('click', async (event) => {
        if (event.target.classList.contains('star')) {
          const rating = event.target.getAttribute('data-value');
          const allStars = stars.querySelectorAll('.star');
          allStars.forEach(star => {
            star.classList.remove('gold');
          });
          for (let i = 0; i < rating; i++) {
            allStars[i].classList.add('gold');
          }
          const recipeId = stars.getAttribute('data-id');
          console.log(`Recipe ID: ${recipeId}, Rating: ${rating} `);
          try {
            const response = await fetch('/api/reviews', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipeId, rating, comment: '',userId: localStorage.getItem('id') }),
            });
            if (response.ok) {
              const updatedRecipe = await response.json();
              if (updatedRecipe) {
                const recipesContainer = document.getElementById('recipes-container');
                const recipeElement = recipesContainer.querySelector(`.recipe[data-id="${recipeId}"]`);
                const reviewsElement = recipeElement.querySelector('ul');
                const newReview = document.createElement('li');
                newReview.textContent = comment;
                reviewsElement.appendChild(newReview);
                const averageRatingElement = recipeElement.querySelector('.rating p:first-child');
                if (updatedRecipe.averageRating) {
                  averageRatingElement.textContent = `Average Rating: ${updatedRecipe.averageRating.toFixed(1)} / 5`;
                }
              }
              window.location.reload();
            } else {
              const error = await response.json();
              alert(`Failed to submit rating: ${error.error}`);
            }
          } catch (error) {
            alert(`Failed to submit rating: ${error.message}`);
          }
        }
      });
    });
    
    document.querySelectorAll('#like').forEach(button => {
      button.addEventListener('click', async (event) => {
        const recipeId = event.target.getAttribute('data-id');
        console.log(`Recipe ID: ${recipeId}`);
        try {
          const response = await fetch('/api/recipes/like', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeId }),
          });
          if (response.ok) {
            const like = await response.json();
            const likesElement = event.target.parentNode.querySelector('span');
            if (likesElement) {
              likesElement.textContent = `Likes: ${like.likes}`;
            } else {
              const likesSpan = document.createElement('span');
              likesSpan.textContent = `Likes: ${like.likes}`;
              event.target.parentNode.appendChild(likesSpan);
            }
            window.location.reload();
            alert('Recipe liked');
          } else {
            alert('You have already liked this recipe');
          }
        } catch (error) {
          alert(`Failed to add like: ${error.message}`);
        }
      });
    });
    
    document.querySelectorAll('#commentBtn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const comment = button.parentNode.querySelector('input').value.trim();
        if (comment !== '') {
          const recipeContainer = button.closest('.recipe');
          const recipeId = recipeContainer.getAttribute('data-id');
          try {
            const response = await fetch('/api/reviews', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipeId, rating: 0, comment, userId: localStorage.getItem('id') }),
            });
            if (response.ok) {
              const updatedRecipe = await response.json();
              if (updatedRecipe) {
                const recipesContainer = document.getElementById('recipes-container');
                const recipeElement = recipesContainer.querySelector(`.recipe[data-id="${recipeId}"]`);
                const reviewsElement = recipeElement.querySelector('ul');
                const newReview = document.createElement('li');
                newReview.textContent = comment;
                reviewsElement.appendChild(newReview);
                const averageRatingElement = recipeElement.querySelector('.rating p:first-child');
                if (updatedRecipe.averageRating) {
                  averageRatingElement.textContent = `Average Rating: ${updatedRecipe.averageRating.toFixed(1)} / 5`;
                }
              }
              window.location.reload();
            } else {
              const error = await response.json();
              alert(`Failed to submit comments: ${error.error}`);
            }
          } catch (error) {
            console.log(error)
            alert(`Failed to submit comment: ${error.message}`);
          }
        } else {
          alert('Please enter a comment');
        }
      });
    });

    document.querySelectorAll('#deleteBtn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const recipeId = event.target.getAttribute('data-id');
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to delete recipe');
            }
        });
    });

    document.querySelectorAll("#follow").forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const authorId = event.target.getAttribute('data-id');
        console.log(`Author ID: ${authorId}`);
        const authorName = event.target.getAttribute('data-name');
        const response = await fetch('/api/recipes/follow', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ authorId, userId: localStorage.getItem('id') })
        });
        if (response.ok) {
          alert(`follow request sent to ${authorName}`);
        }
      })
    })


  } else {
    console.error('Error fetching recipes:', recipes);
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '<p>Error fetching recipes</p>';
  }



// Add the following event listener to the save button
document.querySelectorAll('#saveBtn').forEach(button => {
  button.addEventListener('click', async (event) => {
    const recipeId = event.target.getAttribute('data-id');
    try {
      const userId = localStorage.getItem("id");
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeId, userId })
      });
      if (response.ok) {
        event.target.style.display = 'none';
        alert('Recipe saved');
      } else {
        alert('Failed to save recipe');
      }
    } catch (error) {
      alert(`Failed to save recipe: ${error.message}`);
    }
  });
});


  document.querySelectorAll('.recipe').forEach((recipe) => {
    const addToMyCollectionBtn = document.createElement('button');
    addToMyCollectionBtn.textContent = 'Add to My Collection';
    addToMyCollectionBtn.classList.add('add-to-my-collection-btn');
    addToMyCollectionBtn.setAttribute('data-id', recipe.getAttribute('data-id'));
    recipe.appendChild(addToMyCollectionBtn);
  });


const addToMyCollectionModal = document.getElementById('add-to-my-collection-modal');
const addToMyCollectionModalContent = document.getElementById('add-to-my-collection-modal-content');
const addToMyCollectionModalCloseBtn = document.getElementById('add-to-my-collection-modal-close-btn');

document.querySelectorAll('.add-to-my-collection-btn').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const recipeId = event.target.getAttribute('data-id');
    try {
      const response = await fetch('/api/my-collections?userId=' + localStorage.getItem('id'),{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const myCollections = await response.json();
        const addedCollectionGroupNames = new Set();
        addToMyCollectionModalContent.innerHTML = myCollections.map((myCollection) => {
          if (!addedCollectionGroupNames.has(myCollection.collectionGroupName)) {
            addedCollectionGroupNames.add(myCollection.collectionGroupName);
            return `
              <div>
                <span>${myCollection.collectionGroupName}</span>
                <button class="add-to-my-collection-group-btn" data-collection-id="${myCollection.id}" data-recipe-id="${recipeId}">Add</button>
              </div>
            `;
          }
        }).join('');
        addToMyCollectionModal.style.display = 'block';
        document.querySelectorAll('.add-to-my-collection-group-btn').forEach((button) => {
          console.log("Event listener attached");
          button.addEventListener('click', async (event) => {
            console.log("button clicked");
            const collectionId = event.target.getAttribute('data-collection-id');
            const recipeId = event.target.getAttribute('data-recipe-id');
            console.log(`Collection ID: ${collectionId}, Recipe ID: ${recipeId}`);
            try {
              const response = await fetch('/api/my-collections/add-recipe', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collectionId, recipeId,userId: localStorage.getItem('id') }),
              });
              if (response.ok) {
                addToMyCollectionModal.style.display = 'none';
                alert('Recipe added to my collection');
              } else {
                alert('Failed to add recipe to my collection');
              }
            } catch (error) {
              alert(`Failed to add recipe to my collection: ${error.message}`);
            }
          });
        });
        
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

}
document.addEventListener('DOMContentLoaded', fetchRecipes);
