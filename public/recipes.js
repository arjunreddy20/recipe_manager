const fetchRecipes = async () => {
    const response = await fetch('/api/recipes');
    currentUser = localStorage.getItem("id");
    const recipes = await response.json();

    if (Array.isArray(recipes)) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = recipes.map(recipe => {
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
            ${(recipe.Reviews ? recipe.Reviews.filter(review => review.comment !== null && review.comment !== '').map(review => `<li>${review.comment}</li>`).join('') : '')}
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
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipeId, rating, comment: '' }),
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
    
    document.querySelectorAll('#commentBtn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const comment = button.parentNode.querySelector('input').value.trim();
        if (comment !== '') {
          const recipeContainer = button.closest('.recipe');
          const recipeId = recipeContainer.getAttribute('data-id');
          console.log(`Recipe ID: ${recipeId}, Comment: ${comment}`);
          try {
            const response = await fetch('/api/reviews', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipeId, rating: 0, comment }),
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
      } else {
        alert('Failed to save recipe');
      }
    } catch (error) {
      alert(`Failed to save recipe: ${error.message}`);
    }
  });
});
}
document.addEventListener('DOMContentLoaded', fetchRecipes);
