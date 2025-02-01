const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Custom middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Proxy routes
app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/auth': '' } }));
app.use('/api/analytics', createProxyMiddleware({ target: process.env.ANALYTICS_SERVICE, changeOrigin: true, pathRewrite: { '^/api/analytics': '' } }));
app.use('/api/recipes', createProxyMiddleware({ target: process.env.RECIPE_SERVICE, changeOrigin: true, pathRewrite: { '^/api/recipes': '' } }));
app.use('/api/user', createProxyMiddleware({ target: process.env.USER_SERVICE, changeOrigin: true, pathRewrite: { '^/api/user': '' } }));

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});