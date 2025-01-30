const express = require('express');
const { register, login, verifyToken, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

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

router.post('/logout', authenticate, logout);

module.exports = router;