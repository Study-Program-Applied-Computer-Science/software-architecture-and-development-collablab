const express = require('express');
const Recipe = require('../models/recipe');
const router = express.Router();

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find(req.query); // Supports filtering via query params
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes by ingredients (NEW ENDPOINT)
router.post('/search-by-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients must be provided as an array' });
    }
    try {
      const recipes = await Recipe.find({
        ingredients: { $all: ingredients.map(ing => new RegExp(ing, 'i')) },
      });
      res.status(200).json({ success: true, recipes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }

    // Normalize input: trim spaces and convert to lowercase
    const normalizedIngredients = ingredients
      .filter((ingredient) => ingredient.trim() !== '') // Remove empty strings
      .map((ingredient) => ingredient.trim().toLowerCase());

    if (normalizedIngredients.length === 0) {
      return res.status(400).json({ message: 'At least one valid ingredient must be provided' });
    }

    // Perform case-insensitive and trimmed matching using regex
    const recipes = await Recipe.find({
      ingredients: {
        $all: normalizedIngredients.map(
          (ingredient) => new RegExp(`^${ingredient}$`, 'i') // Case-insensitive exact match
        ),
      },
    });

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found matching the ingredients' });
    }

    res.status(200).json({ success: true, recipes });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

module.exports = router;
