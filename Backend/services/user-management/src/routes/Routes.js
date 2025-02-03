const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// ✅ Middleware to check if the user is an admin

const AUTH_SERVICE_URL = "http://localhost:5002/api/auth"; // Auth Service URL

// Middleware to check if the user is an admin

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Fetch All Users (Admin Only)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Pass JWT token for security
    const response = await axios.get(`${AUTH_SERVICE_URL}/users`, {
      headers: { Authorization: token },
    });

    res.status(200).json(response.data); // Return user data from auth-service
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: "Failed to fetch users" });
  }
});

// Admin: Delete a User
router.delete("/admin/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Get token from admin

    // Forward delete request to the Auth Service
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


