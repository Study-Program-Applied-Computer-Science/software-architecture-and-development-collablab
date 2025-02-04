const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const analyticsRoutes = require("./routes/routes"); // Ensure this path is correct
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Build and log the absolute path for the Swagger API files
const apisPath = path.join(__dirname, "routes", "*.js");
console.log("Swagger API files path:", apisPath);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe Analytics API",
      version: "1.0.0",
      description: "API for logging and managing recipe analytics",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5003}`,
        description: "Local server",
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
      schemas: {
        RecipeAnalytics: {
          type: "object",
          properties: {
            recipeId: {
              type: "string",
              description: "Unique identifier for the recipe",
            },
            views: {
              type: "number",
              description: "Total number of views for the recipe",
            },
            logs: {
              type: "array",
              description: "Array of view logs",
              items: {
                type: "object",
                properties: {
                  action: {
                    type: "string",
                    description: "Action performed (e.g., 'view')",
                  },
                  date: {
                    type: "string",
                    format: "date-time",
                    description: "Timestamp of the action",
                  },
                  userId: {
                    type: "string",
                    description: "User who performed the action",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Use the absolute path we built above
  apis: [apisPath],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Generated Swagger Spec:", JSON.stringify(swaggerSpec, null, 2));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/analytics", analyticsRoutes);

// Default route
app.get("/", (req, res) => res.send("Recipe Analytics API"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Recipe Analytics Service running on port ${PORT}`));
