const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  servings: { type: String, required: true },
  prepTime: { type: Number, required: true }, // Preparation time in minutes
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'], required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
