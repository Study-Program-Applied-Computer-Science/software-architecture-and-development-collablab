const express = require("express");
const mongoose = require("mongoose");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Log a View api endpoint
router.post("/log-view", authMiddleware, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.id;

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


// Restrict Access to Analytics Dashboard for users
router.get("/admin/report", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const analyticsData = await RecipeAnalytics.find();
    if (!analyticsData.length) {
      return res.status(404).json({ message: "No analytics data available." });
    }

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
  


 // Generate Excel report endpoint
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

// Check for Logs endpoint is only accessible for admin
router.get("/admin/logs/check", authMiddleware, async (req, res) => {
if (req.user.role !== "admin") {
 return res.status(403).json({ message: "Access denied. Admins only." });
}

try {
 const logsCount = await RecipeAnalytics.countDocuments({ "logs.0": { $exists: true } });
 res.status(200).json({ logsCount });
} catch (error) {
 console.error("Error checking logs:", error);
 res.status(500).json({ message: "Failed to check logs", error: error.message });
}
});

//Delete Logs endpoint only by admin 
router.delete("/admin/logs", authMiddleware, async (req, res) => {
if (req.user.role !== "admin") {
 return res.status(403).json({ message: "Access denied. Admins only." });
}

try {
 const result = await RecipeAnalytics.deleteMany({});
 res.json({ message: "Analytics logs deleted successfully", deletedCount: result.deletedCount });
} catch (error) {
 console.error("Error deleting logs:", error);
 res.status(500).json({ message: "Failed to delete logs", error: error.message });
}
});

module.exports = router;