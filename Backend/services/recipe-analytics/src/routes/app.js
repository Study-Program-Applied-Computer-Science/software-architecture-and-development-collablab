const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const analyticsRoutes = require("./routes");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/analytics", analyticsRoutes);

// Default route
app.get("/", (req, res) => res.send("Recipe Analytics API"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Recipe Analytics Service running on port ${PORT}`));
