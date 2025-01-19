document.getElementById('find-recipes').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredients').value.trim();

    if (!ingredients) {
        alert('Please enter some ingredients');
        return;
    }

    try {
        const response = await fetch(`/api/recipes?ingredients=${ingredients}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            displayRecipes(data);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('An error occurred while fetching recipes.');
    }
});

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';  // Clear previous results

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h5>${recipe.title}</h5>
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="btn btn-primary">View Recipe</a>
        `;

        recipesContainer.appendChild(recipeElement);
    });
}