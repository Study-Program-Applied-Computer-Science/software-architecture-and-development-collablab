const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,
  date: Date,
  userId: String, // Change to String if userId should be a string
});

const recipeAnalyticsSchema = new mongoose.Schema({
  recipeId: mongoose.Types.ObjectId,
  views: Number,
  logs: [logSchema],
});

module.exports = mongoose.model("RecipeAnalytics", recipeAnalyticsSchema);