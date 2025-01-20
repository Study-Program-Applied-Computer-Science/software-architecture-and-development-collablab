const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  servings: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'], required: true },
  prepTime: { type: Number, required: true }, // Preparation time in minutes
  description: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
