const express = require('express');
const multer = require("multer");
const Recipe = require('../models/recipe');
const axios = require("axios");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
  });

// Multer upload middleware
const upload = multer({ storage });  


//Create recipe (Only logged-in users)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, servings, prepTime, category, ingredients, instructions } = req.body;

    const newRecipe = new Recipe({
      title,
      description,
      servings,
      prepTime,
      category,
      ingredients: JSON.parse(ingredients),
      instructions, 
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.id, // Store user ID in the recipe document
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ message: "Failed to add recipe" });
  }
});

// Get all recipes with filtering and search
router.get("/", async (req, res) => {
    try {
      const { category, search } = req.query;
  
      // Build a query object
      const query = {};
      if (category) {
        query.category = category;
      }
      if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search
      }
  
      const recipes = await Recipe.find(query);
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

// Edit Recipe (Only Owner or Admin)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Ensure only owner or admin can edit
    if (recipe.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    // Construct updated recipe data
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      servings: req.body.servings,
      prepTime: req.body.prepTime,
      category: req.body.category,
      ingredients: JSON.parse(req.body.ingredients), // Parse back from JSON string
      instructions: req.body.instructions,
    };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`; // Update image if new file is uploaded
    }

    // Ensure correct update
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: error.message });
  }
});




// Delete Recipe (Only Owner or Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    //Ensure only owner or admin can delete
    if (recipe.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get only the recipes created by the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id }); // Filter by logged-in user
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// Search recipes by ingredients (NEW ENDPOINT)
router.post('/search-by-ingredients', async (req, res) => {
    try {
      const { ingredients } = req.body;
  
      // Validate input
      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: 'Ingredients must be provided as an array' });
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
  
      // If no recipes are found
      if (recipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found matching the ingredients' });
      }
  
      // Return matched recipes
      return res.status(200).json({ success: true, recipes });
    } catch (error) {
      console.error('Error searching recipes:', error);
      return res.status(500).json({ message: 'Error fetching recipes', error });
    }
  });

  // Request to the Analytics microservice to log the view. This ensures that every time a recipe is fetched, the view is logged in the Analytics microservice.
  router.get("/:id", async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.query.userId || null;
  
    try {
      // Fetch the recipe
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  
      // Log the view to the Analytics microservice
      await axios.post("http://localhost:5005/api/analytics/log-view", {
        recipeId,
        userId,
      });
  
      res.status(200).json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe", error });
    }
  });
  

module.exports = router;
