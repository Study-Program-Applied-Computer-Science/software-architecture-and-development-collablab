const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Build and log the absolute path for the Swagger API docs
const absoluteApisPath = path.join(__dirname, "../routes", "*.js");
console.log("Swagger API files path:", absoluteApisPath);

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Authentication API",
      version: "1.0.0",
      description: "API for user authentication and management",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5002}`,
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [absoluteApisPath], // Use the absolute path here
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Generated Swagger Spec:", JSON.stringify(swaggerSpec, null, 2));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
