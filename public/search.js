const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== '') {
        try {
            const response = await fetch(`/api/search?q=${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                renderSearchResults(data);
            } else {
                alert('Failed to fetch search results');
            }
        } catch (error) {
            alert(`Failed to fetch search results: ${error.message}`);
        }
    } else {
        alert('Please enter a search query');
    }
});

const renderSearchResults = (data) => {
    searchResults.innerHTML = '';
    data.forEach((recipe) => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <h2>${recipe.title}</h2>
            <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
            <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
            <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
            <h4><strong>Posted By:</strong>${recipe.name}<h4>
            <img src="${recipe.image}" alt="${recipe.title}">
        `;
        searchResults.appendChild(recipeElement);
    });
};