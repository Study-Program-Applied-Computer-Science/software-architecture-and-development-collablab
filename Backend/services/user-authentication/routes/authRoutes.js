const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('Register request body:', req.body); // Debug statement
  next();
}, register);

router.post('/login', (req, res, next) => {
  console.log('Login request body:', req.body); // Debug statement
  next();
}, login);

router.get('/verify', authMiddleware, verifyToken);

module.exports = router;