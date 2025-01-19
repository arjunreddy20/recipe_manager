const fetchAuthors = async () => {
    try {
        const response = await fetch('/api/authors');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const authors = await response.json();
        console.log(authors)
        const authorsContainer = document.getElementById('authors-container');
        authorsContainer.innerHTML = authors.map(author => `
            <div class="author">
                <p class="rp">Name: <strong>${author.name}</strong>  -  Recipes: ${author.recipeCount}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
        const authorsContainer = document.getElementById('authors-container');
        authorsContainer.innerHTML = '<p>Error fetching authors</p>';
    }
};

document.addEventListener('DOMContentLoaded', fetchAuthors);