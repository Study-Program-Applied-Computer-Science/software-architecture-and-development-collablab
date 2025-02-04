const express = require("express");
const multer = require("multer");
const Recipe = require("../models/recipe");
const axios = require("axios");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Set up multer storage
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

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API endpoints for managing recipes
 */

/**
 * @swagger
 * /api/recipes/dummy:
 *   get:
 *     summary: Dummy endpoint for testing Swagger documentation
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Dummy endpoint working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/dummy", (req, res) => {
  res.status(200).json({ message: "Dummy endpoint works!" });
});

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe (Only logged-in users)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               servings:
 *                 type: number
 *               prepTime:
 *                 type: number
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON string of the ingredients array
 *               instructions:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       500:
 *         description: Failed to add recipe
 */
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

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes with filtering and search
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter recipes by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search recipes by title (case-insensitive)
 *     responses:
 *       200:
 *         description: List of recipes
 *       500:
 *         description: Error fetching recipes
 */
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    // Build a query object
    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };
    const recipes = await Recipe.find(query);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe found
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error fetching recipe
 */
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Edit a recipe (Only owner or admin)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               servings:
 *                 type: number
 *               prepTime:
 *                 type: number
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON string of the ingredients array
 *               instructions:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Update error
 *       403:
 *         description: Not authorized to edit this recipe
 *       404:
 *         description: Recipe not found
 */
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
      ingredients: JSON.parse(req.body.ingredients),
      instructions: req.body.instructions,
    };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

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

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe (Only owner or admin)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       403:
 *         description: Not authorized to delete this recipe
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error deleting recipe
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Ensure only owner or admin can delete
    if (recipe.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/recipes/my-recipes:
 *   get:
 *     summary: Get only the recipes created by the logged-in user
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's recipes
 *       500:
 *         description: Error fetching recipes
 */
router.get("/my-recipes", authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

/**
 * @swagger
 * /api/recipes/search-by-ingredients:
 *   post:
 *     summary: Search recipes by ingredients
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of ingredients to search for
 *     responses:
 *       200:
 *         description: Recipes found matching the ingredients
 *       400:
 *         description: Invalid input or no valid ingredients provided
 *       404:
 *         description: No recipes found matching the ingredients
 *       500:
 *         description: Error fetching recipes
 */
router.post("/search-by-ingredients", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Ingredients must be provided as an array" });
    }
    const normalizedIngredients = ingredients
      .filter((ingredient) => ingredient.trim() !== "")
      .map((ingredient) => ingredient.trim().toLowerCase());
    if (normalizedIngredients.length === 0) {
      return res.status(400).json({ message: "At least one valid ingredient must be provided" });
    }
    const recipes = await Recipe.find({
      ingredients: {
        $all: normalizedIngredients.map(
          (ingredient) => new RegExp(`^${ingredient}$`, "i")
        ),
      },
    });
    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found matching the ingredients" });
    }
    return res.status(200).json({ success: true, recipes });
  } catch (error) {
    console.error("Error searching recipes:", error);
    return res.status(500).json({ message: "Error fetching recipes", error });
  }
});

/**
 * @swagger
 * /api/recipes/{id}/log-view:
 *   get:
 *     summary: Request to the Analytics microservice to log a view for a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (optional)
 *     responses:
 *       200:
 *         description: Recipe fetched successfully and view logged
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error fetching recipe or logging view
 */
router.get("/:id/log-view", async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.query.userId || null;
  try {
    // Fetch the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    // Log the view to the Analytics microservice
    await axios.post("http://localhost:5005/api/analytics/log-view", { recipeId, userId });
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Failed to fetch recipe", error });
  }
});

module.exports = router;
