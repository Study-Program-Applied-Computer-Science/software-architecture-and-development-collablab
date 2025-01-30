const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require("cors");
const authRoutes = require('../routes/authRoutes'); // Adjust the path as needed

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Ensure this line is present to parse JSON requests

app.use(cors({ origin: "http://localhost:8080", credentials: true }));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});