const fetchCollections = async () => {
    try {
      const response = await fetch(`/api/collections?userId=${localStorage.getItem('id')}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const collections = data.collections.filter((collection, index, self) => self.findIndex(c => c.recipeId === collection.recipeId) === index);
        console.log(collections)
        const recipes = await fetch('/api/recipes',{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const recipesData = await recipes.json();
        const unsavedRecipes = recipesData.filter(recipe => !collections.includes(recipe.id));
        const collectionsContainer = document.getElementById('collections-container');
        collectionsContainer.innerHTML = collections.map(collection => {

            return  `
            <div class="recipe" data-id="${collection.Recipe.id}">
            <h2>${collection.Recipe.title}</h2>
            <p><strong>Ingredients required:</strong> ${collection.Recipe.ingredients}</p>
            <p><strong>Instructions to follow:</strong> ${collection.Recipe.instructions}</p>
            <p><strong>Cooking Time:</strong> ${collection.Recipe.cookingTime} hours</p>
            <p><strong>Serves Upto:</strong> ${collection.Recipe.servings}</p>
            <h4><strong>Posted By:</strong>${collection.Recipe.name}<h4>
            <img src="${collection.Recipe.image}" alt="${collection.Recipe.title}">
            <button type="submit" id="unsaveBtn" data-id="${collection.Recipe.id}">Unsave</button>
          </div>
        `}).join('');
        document.querySelectorAll('#unsaveBtn').forEach(button => {
            button.addEventListener('click', async (event) => {
              const recipeId = event.target.getAttribute('data-id');
              const response = await fetch('/api/collections', {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipeId, userId: localStorage.getItem('id') })
              });
              if (response.ok) {
                window.location.reload();
              } else {
                alert('Failed to unsave recipe');
              }
            });
          });
      } else {
        alert('Failed to fetch collections');
      }
    } catch (error) {
      alert(`Failed to fetch collections: ${error.message}`);
    }
  };
  
  document.addEventListener('DOMContentLoaded', fetchCollections);