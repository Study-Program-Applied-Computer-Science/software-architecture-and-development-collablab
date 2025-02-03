const express = require("express");
const mongoose = require("mongoose");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// ✅ Log a View API - Logs User Views Recipe
router.post("/log-view", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token

    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid Recipe ID format" });
    }

    let record = await RecipeAnalytics.findOne({ recipeId });

    if (!record) {
      // ✅ Create a new record if recipe does not exist
      record = new RecipeAnalytics({
        recipeId,
        views: 1,
        logs: [{ action: "view", date: new Date(), userId }]
      });
      await record.save();
    } else {
      // ✅ If record exists, update views count and push log
      record.views += 1;
      record.logs.push({ action: "view", date: new Date(), userId });
      await record.save();
    }

    res.status(200).json({ message: "View logged successfully", record });
  } catch (error) {
    console.error("Error logging view:", error);
    res.status(500).json({ message: "Failed to log view", error: error.message });
  }
});

// ✅ Get all logged views
router.get("/all-logs", authMiddleware, async (req, res) => {
  try {
    const logs = await RecipeAnalytics.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
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
      return res.status(200).json({ message: "No recent logs available for report." });
    }

    // Format data for report
    const formattedData = analyticsData.map((item) => ({
      RecipeId: item.recipeId.toString(),
      Views: item.views || 0,
      Favorites: item.logs ? item.logs.filter((log) => log.action === "favorite").length : 0,
      LastViewed: item.logs?.length ? item.logs[item.logs.length - 1].date : "N/A",
    }));

    if (!formattedData.length) {
      return res.status(404).json({ message: "No recent logs available for report." });
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

// try {
//  const logsCount = await RecipeAnalytics.countDocuments({ "logs.0": { $exists: true } });

try {
  const logsCount = await RecipeAnalytics.aggregate([
    { $unwind: "$logs" }, // Flatten logs array
    { $count: "totalLogs" } // Count total logs
  ]);




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
  // Delete logs but keep recipe analytics structure intact
  const result = await RecipeAnalytics.updateMany({}, { $set: { logs: [], views: 0 } });

  if (result.modifiedCount === 0) {
    return res.status(200).json({ message: "No logs were deleted because there were none." });
  }

  res.status(200).json({ message: "Analytics logs deleted successfully.", deletedCount: result.modifiedCount });
} catch (error) {
  console.error("Error deleting logs:", error);
  res.status(500).json({ message: "Failed to delete logs", error: error.message });
}
});

module.exports = router;