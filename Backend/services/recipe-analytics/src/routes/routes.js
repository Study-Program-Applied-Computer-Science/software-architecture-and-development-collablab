const express = require("express");
const mongoose = require("mongoose");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");
const app = require("../app");

const router = express.Router();

// Log a View api endpoint
router.post("/log-view", async (req, res) => {
  const { recipeId, userId } = req.body;

  if (!recipeId || !userId) {
    return res.status(400).json({ message: "Recipe ID and User ID are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: "Invalid Recipe ID format" });
  }

  try {

    const record = await RecipeAnalytics.findOneAndUpdate(
      { recipeId },
      {
        $inc: { views: 1 },
        $push: { logs: { action: "view", date: new Date(), userId } },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "View logged successfully", record });
  } catch (error) {
    console.error("Error logging view:", error);
    res.status(500).json({ message: "Failed to log view", error: error.message });
  }
});

// Generate Excel Report api endpoint
router.get("/admin/report", async (req, res) => {
  try {
    const analyticsData = await RecipeAnalytics.find();

    if (!analyticsData.length) {
      return res.status(404).json({ message: "No analytics data available." });
    }
    
    // //fetch recipe names
    // const recipeIds = analyticsData.map((item) => item.recipeId);
    // const recipes = await Recipe.find({ _id: { $in: recipeIds } }).select("_id name");

    // //handling missu=ing recipe names
    // const recipeMap = {};
    // recipes.forEach(recipe => {
    //   recipeMap[recipe._id.toString()] = recipe.name || "Unknown Recipe";
    // });

    // Format data for report
    const formattedData = analyticsData.map((item) => ({
      RecipeId: item.recipeId.toString(),
      Views: item.views || 0,
      Favorites: item.logs ? item.logs.filter((log) => log.action === "favorite").length : 0,
      LastViewed: item.logs?.length ? item.logs[item.logs.length - 1].date : "N/A",
    }));

    if (!formattedData.length) {
      return res.status(404).json({ message: "No valid analytics data found." });
    }
     
    // From here excel report will be generated
    const workbook = excel.utils.book_new();
    const worksheet = excel.utils.json_to_sheet(formattedData);
    excel.utils.book_append_sheet(workbook, worksheet, "Analytics");

    const buffer = excel.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=analytics-report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
});

// Endpoint for check for Logs 
router.get("/admin/logs/check", async (req, res) => {
  try {
    const logsCount = await RecipeAnalytics.countDocuments({ "logs.0": { $exists: true } });
    res.status(200).json({ logsCount });
  } catch (error) {
    console.error("Error checking logs:", error);
    res.status(500).json({ message: "Failed to check logs", error: error.message });
  }
});

// Endpoint for delete Logs
router.delete("/admin/logs", async (req, res) => {
  try {
    const result = await RecipeAnalytics.deleteMany({});
    res.json({ message: "Analytics logs deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting logs:", error);
    res.status(500).json({ message: "Failed to delete logs", error: error.message });
  }
});

module.exports = router;
