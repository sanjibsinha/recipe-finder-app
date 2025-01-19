I'll walk you through how to build a simple Recipe Finder app using Express.js as the backend, and HTML, CSS, JavaScript, and Bootstrap for the frontend. The app will allow users to input ingredients and get a list of recipes that contain those ingredients.

 Steps:
1. Set up Express backend
2. Create API to fetch recipe data
3. Build frontend interface (HTML, CSS, Bootstrap)
4. Connect backend with frontend using JavaScript
5. Handle data and display recipes

 Step 1: Set up Express Backend

1. First, let's set up your backend using Express.js. Open your terminal and create a new directory for your project:

```bash
mkdir recipe-finder-app
cd recipe-finder-app
```

2. Initialize a new Node.js project and install Express, code and commands you will get in the GitHub Repo. The link is in description below.

```bash
npm init -y
npm install express axios
```

3. Create a file named `server.js` in your project root:

```js
// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files (for frontend)
app.use(express.static('public'));

// Recipe API route
app.get('/api/recipes', async (req, res) => {
    const { ingredients } = req.query;

    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients are required' });
    }

    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=YOUR_API_KEY`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

Make sure to replace `YOUR_API_KEY` with your actual Spoonacular API key. You can get one by signing up on their website: [Spoonacular API](https://spoonacular.com/food-api).

 Step 2: Build the Frontend

1. Create a folder named `public` in your project root. This will hold all your frontend files.

```bash
mkdir public
```

2. Inside the `public` folder, create the following files:
   - `index.html`
   - `style.css`
   - `app.js`

3. index.html (HTML structure):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Finder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Recipe Finder</h1>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <input type="text" id="ingredients" class="form-control" placeholder="Enter ingredients (comma separated)">
                <button class="btn btn-primary mt-3" id="find-recipes">Find Recipes</button>
            </div>
        </div>

        <div id="recipes" class="mt-5">
            <!-- Recipes will be displayed here -->
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

4. style.css (Custom styles):

```css
body {
    background-color: f8f9fa;
}

recipes .recipe {
    border: 1px solid ddd;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    background-color: fff;
}

.recipe img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.recipe h5 {
    margin-top: 10px;
}
```

5. app.js (JavaScript logic for handling the API request and displaying recipes):

```js
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
```

 Step 3: Run the App

1. Make sure you've added your Spoonacular API key in `server.js`.
2. Now, start the backend by running:

```bash
node server.js
```

3. Open a browser and go to `http://localhost:3000`. You should see the Recipe Finder UI.

 How it works:
- The user enters ingredients in the input field.
- When they click the "Find Recipes" button, the frontend makes a request to the Express backend with the entered ingredients.
- The backend fetches recipes using the Spoonacular API and returns the data to the frontend.
- The frontend displays the recipes, including the title, image, and a link to the full recipe.

 Final Thoughts:
This is a basic example to get you started. You can extend it further by:
- Adding error handling and loading states.
- Allowing users to filter results by cuisine or dietary preferences.
- Styling the app further using Bootstrap or custom CSS.

Let's extend your Recipe Finder App by adding the following features:

1. Error handling – We'll display user-friendly error messages.
2. Loading state – We'll show a loading spinner while the data is being fetched.
3. Filter by cuisine and dietary preferences – We'll add options to filter the results based on cuisine type and dietary preferences.
4. Styling enhancements – We'll improve the layout and design using Bootstrap and custom CSS.

 Updated Project Structure:
Backend: We'll extend the backend to handle additional filters like cuisine and dietary preferences.
Frontend: We'll add new filters and show a loading spinner during API requests.



 Step 1: Backend Changes (Express)

Let's update the backend to accept filters for cuisine and dietary preferences.

1. Modify the `server.js` to handle new query parameters for cuisine and diet.

 Updated `server.js`:

```js
// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files (for frontend)
app.use(express.static('public'));

// Recipe API route
app.get('/api/recipes', async (req, res) => {
    const { ingredients, cuisine, diet } = req.query;

    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients are required' });
    }

    let apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=YOUR_API_KEY`;

    // Add filters for cuisine and diet if present
    if (cuisine) {
        apiUrl += `&cuisine=${cuisine}`;
    }
    if (diet) {
        apiUrl += `&diet=${diet}`;
    }

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

 Step 2: Frontend Changes (HTML, CSS, JavaScript)

Now, let's update the frontend to:
- Add cuisine and dietary preference dropdowns.
- Show a loading spinner while data is being fetched.
- Display error messages when something goes wrong.

 Updated `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Finder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Recipe Finder</h1>
        
        <div class="row justify-content-center">
            <div class="col-md-8">
                <input type="text" id="ingredients" class="form-control" placeholder="Enter ingredients (comma separated)">
                <button class="btn btn-primary mt-3" id="find-recipes">Find Recipes</button>
            </div>
        </div>

        <div class="row mt-4 justify-content-center">
            <div class="col-md-3">
                <select id="cuisine" class="form-select">
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <!-- Add more cuisines as needed -->
                </select>
            </div>
            <div class="col-md-3">
                <select id="diet" class="form-select">
                    <option value="">Select Diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="glutenFree">Gluten-Free</option>
                    <option value="dairyFree">Dairy-Free</option>
                    <!-- Add more dietary options as needed -->
                </select>
            </div>
        </div>

        <div id="loading" class="text-center mt-4" style="display: none;">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div id="error-message" class="alert alert-danger mt-4" style="display: none;"></div>

        <div id="recipes" class="mt-5">
            <!-- Recipes will be displayed here -->
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

 Updated `app.js`:

```js
document.getElementById('find-recipes').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredients').value.trim();
    const cuisine = document.getElementById('cuisine').value;
    const diet = document.getElementById('diet').value;

    if (!ingredients) {
        alert('Please enter some ingredients');
        return;
    }

    // Show loading spinner
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('recipes').innerHTML = '';

    try {
        const response = await fetch(`/api/recipes?ingredients=${ingredients}&cuisine=${cuisine}&diet=${diet}`);
        const data = await response.json();

        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';

        if (data.error) {
            showError(data.error);
        } else {
            displayRecipes(data);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
        showError('An error occurred while fetching recipes.');
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

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
```

 Updated `style.css`:

```css
body {
    background-color: f8f9fa;
}

recipes .recipe {
    border: 1px solid ddd;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    background-color: fff;
}

.recipe img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.recipe h5 {
    margin-top: 10px;
}

loading {
    display: none;
}
```

 Explanation of Changes:

 1. Backend (Express):
   - The API now accepts `cuisine` and `diet` as optional query parameters. These values are appended to the Spoonacular API request if provided.

 2. Frontend (HTML):
   Cuisine and Diet filters: We added dropdowns for cuisine and dietary preference filters.
   Loading spinner: A Bootstrap spinner is shown while fetching data.
   Error message: A section to show error messages in case something goes wrong.

 3. JavaScript (app.js):
   - We handle the loading state by showing and hiding the spinner.
   - The `displayRecipes` function is responsible for rendering the recipes.
   - The `showError` function displays any error message.



 Step 3: Run the App

1. Replace `YOUR_API_KEY` in `server.js` with your actual Spoonacular API key.
2. Start the backend server:

```bash
node server.js
```

3. Open the app in your browser at `http://localhost:3000`.



 Final Thoughts:
- The app now has enhanced features such as filtering by cuisine and dietary preference.
- We added error handling and a loading spinner for better user experience.
- The design has been improved with Bootstrap components.
