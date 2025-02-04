const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const AUTH_SERVICE_URL = "http://localhost:5002/api/auth"; // Auth Service URL

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Endpoints for managing users
 */

/**
 * @swagger
 * /api/user-management/dummy:
 *   get:
 *     summary: Dummy endpoint for testing Swagger documentation
 *     tags: [User Management]
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
 * /api/user-management/users:
 *   get:
 *     summary: Fetch all users (Admin Only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users (passwords excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Failed to fetch users
 */
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Pass JWT token for security
    const response = await axios.get(`${AUTH_SERVICE_URL}/users`, {
      headers: { Authorization: token },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: "Failed to fetch users" });
  }
});

/**
 * @swagger
 * /api/user-management/admin/user/{id}:
 *   delete:
 *     summary: Delete a user (Admin Only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete("/admin/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Get token from admin
    const response = await axios.delete(`${AUTH_SERVICE_URL}/user/${req.params.id}`, {
      headers: { Authorization: token },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
