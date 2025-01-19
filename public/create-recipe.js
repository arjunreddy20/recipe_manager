const createRecipe = async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('create-recipe-form'));
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("id");
    if (!token || !userId) {
      alert('Please login to create a recipe');
      return;
    }
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        title: formData.get('title'),
        ingredients: formData.get('ingredients'),
        instructions: formData.get('instructions'),
        cookingTime: formData.get('cookingTime'),
        servings: formData.get('serving'),
        image: formData.get('imageUrl'),
        userId:userId
      })
    });
    if (response.ok) {
      window.location.href = 'recipes.html';
    } else {
      alert('Failed to create recipe');
    }
};

document.addEventListener('DOMContentLoaded', (event) => {
document.getElementById('create-recipe-form').addEventListener('submit', createRecipe);
});