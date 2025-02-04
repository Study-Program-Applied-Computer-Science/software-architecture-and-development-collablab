const express = require('express');
const { register, login, verifyToken, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', (req, res, next) => {
  console.log('Register request body:', req.body); // Debug statement
  next();
}, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', (req, res, next) => {
  console.log('Login request body:', req.body); // Debug statement
  next();
}, login);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify the authentication token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized
 */
router.get('/verify', authenticate, verifyToken);

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Admin-only endpoint
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome, admin!
 *       403:
 *         description: Forbidden
 */
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ msg: 'Welcome, admin!' });
});

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: User-only endpoint
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome, user!
 *       403:
 *         description: Forbidden
 */
router.get('/user', authenticate, authorize('user'), (req, res) => {
  res.json({ msg: 'Welcome, user!' });
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (Admin Only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users (passwords excluded)
 *       500:
 *         description: Failed to fetch users
 */
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * @swagger
 * /api/auth/user/{id}:
 *   delete:
 *     summary: Delete a user (Admin Only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', authenticate, logout);

module.exports = router;
