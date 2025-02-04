const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/Routes");

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

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
      title: "User Management API",
      version: "1.0.0",
      description: "API for managing user data",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: "Local Server",
      },
    ],
  },
  apis: [apisPath],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Generated Swagger Spec:", JSON.stringify(swaggerSpec, null, 2));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount user management routes
app.use("/api/user-management", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`User Management Service running on port ${PORT}`);
});
