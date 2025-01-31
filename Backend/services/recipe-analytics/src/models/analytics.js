const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,
  date: Date,
  userId: String,
});

const recipeAnalyticsSchema = new mongoose.Schema({
  recipeId: mongoose.Types.ObjectId,
  views: Number,
  logs: [logSchema],
});

module.exports = mongoose.model("RecipeAnalytics", recipeAnalyticsSchema);