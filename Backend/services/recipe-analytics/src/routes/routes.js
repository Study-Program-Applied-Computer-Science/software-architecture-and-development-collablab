const express = require("express");
const mongoose = require("mongoose");
const RecipeAnalytics = require("../models/analytics");
const excel = require("xlsx");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Operations related to recipe analytics
 *
 * components:
 *   schemas:
 *     RecipeAnalytics:
 *       type: object
 *       properties:
 *         recipeId:
 *           type: string
 *           description: Unique identifier for the recipe
 *         views:
 *           type: number
 *           description: Total number of views for the recipe
 *         logs:
 *           type: array
 *           description: Array of view logs
 *           items:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: Action performed (e.g., 'view')
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the action
 *               userId:
 *                 type: string
 *                 description: User who performed the action
 */

/**
 * @swagger
 * /api/analytics/dummy:
 *   get:
 *     summary: Dummy endpoint for testing Swagger documentation
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dummy endpoint working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/dummy", (req, res) => {
  res.status(200).json({ message: "Dummy endpoint works!" });
});

/**
 * @swagger
 * /api/analytics/log-view:
 *   post:
 *     summary: Log a view for a recipe
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: The ID of the recipe being viewed
 *             example:
 *               recipeId: "615f5f5f5f5f5f5f5f5f5f5f"
 *     responses:
 *       200:
 *         description: View logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 record:
 *                   $ref: '#/components/schemas/RecipeAnalytics'
 *       400:
 *         description: Invalid Recipe ID or missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/log-view", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid or missing Recipe ID" });
    }

    let record = await RecipeAnalytics.findOne({ recipeId });

    if (!record) {
      record = new RecipeAnalytics({
        recipeId,
        views: 1,
        logs: [{ action: "view", date: new Date(), userId }],
      });
    } else {
      record.views += 1;
      record.logs.push({ action: "view", date: new Date(), userId });
    }

    await record.save();
    res.status(200).json({ message: "View logged successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to log view", error: error.message });
  }
});

/**
 * @swagger
 * /api/analytics/all-logs:
 *   get:
 *     summary: Get all logged views
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all logged views
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeAnalytics'
 *       500:
 *         description: Internal server error
 */
router.get("/all-logs", authMiddleware, async (req, res) => {
  try {
    const logs = await RecipeAnalytics.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs", error: error.message });
  }
});

/**
 * @swagger
 * /api/analytics/admin/report:
 *   get:
 *     summary: Generate an Excel report of analytics (Admin only)
 *     tags: [Analytics, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel report generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Internal server error
 */
router.get("/admin/report", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const analyticsData = await RecipeAnalytics.find();

    if (!analyticsData.length) {
      return res.status(200).json({ message: "No recent logs available for report." });
    }

    const formattedData = analyticsData.map((item) => ({
      RecipeId: item.recipeId.toString(),
      Views: item.views || 0,
      Favorites: item.logs.filter((log) => log.action === "favorite").length,
      LastViewed: item.logs.length ? item.logs[item.logs.length - 1].date : "N/A",
    }));

    const workbook = excel.utils.book_new();
    const worksheet = excel.utils.json_to_sheet(formattedData);
    excel.utils.book_append_sheet(workbook, worksheet, "Analytics");

    const buffer = excel.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=analytics-report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
});

/**
 * @swagger
 * /api/analytics/admin/logs/check:
 *   get:
 *     summary: Check total logs (Admin only)
 *     tags: [Analytics, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total logs count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logsCount:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalLogs:
 *                         type: number
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Internal server error
 */
router.get("/admin/logs/check", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const logsCount = await RecipeAnalytics.aggregate([
      { $unwind: "$logs" },
      { $count: "totalLogs" },
    ]);

    res.status(200).json({ logsCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to check logs", error: error.message });
  }
});

/**
 * @swagger
 * /api/analytics/admin/logs:
 *   delete:
 *     summary: Delete all logs (Admin only)
 *     tags: [Analytics, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: number
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Internal server error
 */
router.delete("/admin/logs", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const result = await RecipeAnalytics.updateMany({}, { $set: { logs: [], views: 0 } });
    res.status(200).json({
      message: "Analytics logs deleted successfully.",
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete logs", error: error.message });
  }
});

/**
 * @swagger
 * /api/analytics/{id}:
 *   get:
 *     summary: Get a single recipe and log the view (combined endpoint)
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (optional)
 *     responses:
 *       200:
 *         description: Recipe fetched successfully and view logged
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.query.userId || null;

  try {
    // Fetch the recipe
    const recipe = await RecipeAnalytics.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Log the view to the Analytics microservice
    await axios.post("http://localhost:5005/api/analytics/log-view", {
      recipeId,
      userId,
    });

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Failed to fetch recipe", error });
  }
});

module.exports = router;
