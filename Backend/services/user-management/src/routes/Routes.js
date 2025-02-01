const express = require('express');
/* const User = require('../models/User');
const Ingredient = require('../models/Ingredient'); */
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};


// Delete User
/* router.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// Edit user
/* router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedData = req.body; 
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// Get all users
/* router.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password field for security
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }); */

  // Add a new user
/* router.post('/user', async (req, res) => {
    try {
      // Create a new user instance
      const newUser = new User(req.body);
      // Save the user to the database
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }); */
  //Updating and deleting recipes; admin

  
  // Update a recipe (Admin Only)
  /* router.put("/recipe/:id", isAdmin, async (req, res) => {
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
  }); */
  
  // Delete a recipe (Admin Only)
  /* router.delete("/recipe/:id", isAdmin, async (req, res) => {
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
  }); */

  // ✅ Get all users (Admins only)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete User
router.delete("/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin deletes a recipe
router.delete("/recipe/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

  
  module.exports = router;
  
