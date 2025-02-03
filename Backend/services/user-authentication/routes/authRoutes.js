const express = require('express');
const { register, login, verifyToken, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const User = require("../models/User"); // Import User model

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('Register request body:', req.body); // Debug statement
  next();
}, register);

router.post('/login', (req, res, next) => {
  console.log('Login request body:', req.body); // Debug statement
  next();
}, login);

router.get('/verify', authenticate, verifyToken);

// Protect routes with role-based access control
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ msg: 'Welcome, admin!' });
});

router.get('/user', authenticate, authorize('user'), (req, res) => {
  res.json({ msg: 'Welcome, user!' });
});

// Get all users (Admin Only)
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords for security
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Delete a user (Admin Only)
router.delete("/user/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.post('/logout', authenticate, logout);

module.exports = router;