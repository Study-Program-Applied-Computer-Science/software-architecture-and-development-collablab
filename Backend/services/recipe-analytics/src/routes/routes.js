const express = require("express");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Generate Excel Report
router.get("/admin/report", async (req, res) => {
  try {
    const analyticsData = await RecipeAnalytics.find();

    const formattedData = analyticsData.map((item) => ({
      RecipeID: item.recipeId,
      Views: item.views,
      Favorites: item.logs?.length || 0, // Assuming favorites can be derived from logs
      LastViewed: item.logs?.[item.logs.length - 1]?.date || "N/A",
    }));

    const workbook = excel.utils.book_new();
    const worksheet = excel.utils.json_to_sheet(formattedData);
    excel.utils.book_append_sheet(workbook, worksheet, "Analytics");

    const filePath = path.join(__dirname, "report.xlsx");
    excel.writeFile(workbook, filePath);

    res.download(filePath, "analytics-report.xlsx", () => {
      fs.unlinkSync(filePath); // Clean up the file after download
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
});

// Delete Logs
router.delete("/admin/logs", async (req, res) => {
  try {
    await RecipeAnalytics.deleteMany({});
    res.json({ message: "Analytics logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting logs", error });
  }
});

module.exports = router;
