// filepath: /c:/Users/gowda/Downloads/Cooking_Assistant/software-architecture-and-development-collablab/Backend/services/user-authentication/src/app.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('../routes/authRoutes'); // Adjust the path as needed

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Ensure this line is present to parse JSON requests

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});