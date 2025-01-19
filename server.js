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

    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=your-api-key`;

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