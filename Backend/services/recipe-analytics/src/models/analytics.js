const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  views: { type: Number, default: 0 },
  logs: [
    {
      date: { type: Date, default: Date.now },
      action: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

module.exports = mongoose.model("Analytics", analyticsSchema);
