const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/recipes', recipeRoutes);
// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Default route
app.get('/', (req, res) => res.send('Recipe Vault API'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));