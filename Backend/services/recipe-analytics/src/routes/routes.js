const express = require("express");
const mongoose = require("mongoose");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");

const router = express.Router();

/**
 * Generate Excel Report
 */
router.get("/admin/report", async (req, res) => {
  try {
    const analyticsData = await RecipeAnalytics.find();

    if (!analyticsData.length) {
      return res.status(404).json({ message: "No analytics data available." });
    }

    const formattedData = analyticsData.map((item) => ({
      RecipeID: item.recipeId.toString(),
      Views: item.views,
      Favorites: item.logs.filter((log) => log.action === "favorite").length, // Adjust as per 'favorites' logic
      LastViewed: item.logs?.[item.logs.length - 1]?.date || "N/A",
    }));

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

/**
 * Delete Logs
 */
router.delete("/admin/logs", async (req, res) => {
  try {
    const result = await RecipeAnalytics.deleteMany({});
    res.json({ message: "Analytics logs deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting logs:", error);
    res.status(500).json({ message: "Error deleting logs", error: error.message });
  }
});

/**
 * Log a View
 */
router.post("/log-view", async (req, res) => {
  const { recipeId, userId } = req.body;

  if (!recipeId || !userId) {
    return res.status(400).json({ message: "Recipe ID and User ID are required" });
  }

  try {
    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const record = await RecipeAnalytics.findOneAndUpdate(
      { recipeId: recipeObjectId },
      {
        $inc: { views: 1 },
        $push: { logs: { action: "view", date: new Date(), userId: userObjectId } },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "View logged successfully", record });
  } catch (error) {
    console.error("Error logging view:", error);
    res.status(500).json({ message: "Failed to log view", error: error.message });
  }
});

/**
 * Check for Logs
 */
router.get("/admin/logs/check", async (req, res) => {
  try {
    const logsExist = await RecipeAnalytics.exists({ "logs.0": { $exists: true } });
    res.status(200).json({ hasLogs: !!logsExist });
  } catch (error) {
    console.error("Error checking logs:", error);
    res.status(500).json({ message: "Failed to check logs", error: error.message });
  }
});

module.exports = router;
