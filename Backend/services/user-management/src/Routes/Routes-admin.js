const express = require("express");
const Recipe = require("../../recipe-vault/models/recipe"); // Import Recipe model
const { isAdmin } = require("../middleware/authMiddleware"); // Middleware to check admin role

const router = express.Router();

// Update a recipe (Admin Only)
router.put("/recipe/:id", isAdmin, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});

// Delete a recipe (Admin Only)
router.delete("/recipe/:id", isAdmin, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

module.exports = router;
