const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const recipeRoutes = require("./routes/recipes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Build and log the absolute path for the Swagger API docs
const apisPath = path.join(__dirname, "routes", "*.js");
console.log("Swagger API files path:", apisPath);

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe Vault API",
      version: "1.0.0",
      description: "API for managing and searching recipes",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
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
  apis: [apisPath], // Use the absolute path here
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Generated Swagger Spec:", JSON.stringify(swaggerSpec, null, 2));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/recipes", recipeRoutes);

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default route
app.get("/", (req, res) => res.send("Recipe Vault API"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
