const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");
const logger = require("../../services/logging"); 
const { correlationIdMiddleware } = require("../../services/correlationId"); 

// Swagger dependencies
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow a list of specific origins
    const allowedOrigins = ['http://localhost:5006', 'http://localhost:8080','http://188.166.164.220:5006'];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware to generate or retrieve correlation IDs
app.use(correlationIdMiddleware);

// Custom middleware to log incoming requests
app.use((req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    correlationId: req.headers["x-correlation-id"] || "N/A",
  });
  next();
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Proxy endpoint for Auth Service
 *   - name: Analytics
 *     description: Proxy endpoint for Analytics Service
 *   - name: Recipes
 *     description: Proxy endpoint for Recipe Service
 *   - name: User Management
 *     description: Proxy endpoint for User Management Service
 */

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Proxy GET request to Auth Service
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful response from Auth Service
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Proxy GET request to Analytics Service
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Successful response from Analytics Service
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Proxy GET request to Recipe Service
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Successful response from Recipe Service
 */

/**
 * @swagger
 * /api/user-management:
 *   get:
 *     summary: Proxy GET request to User Management Service
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: Successful response from User Management Service
 */

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gateway",
      version: "1.0.0",
      description:
        "API Gateway for microservices: Auth, Analytics, Recipes, and User Management",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5005}`,
        description: "Local Gateway",
      },
    ],
  },
  
  apis: [path.join(__dirname, "*.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Proxy routes
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
  })
);
app.use(
  "/api/analytics",
  createProxyMiddleware({
    target: process.env.ANALYTICS_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/analytics": "" },
  })
);
app.use(
  "/api/recipes",
  createProxyMiddleware({
    target: process.env.RECIPE_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/recipes": "" },
  })
);
app.use(
  "/api/user-management",
  createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/user-management": "" },
  })
);

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
