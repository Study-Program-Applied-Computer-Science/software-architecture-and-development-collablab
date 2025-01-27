const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Routes = require('./routes/Routes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/admin', Routes);

// Routes
app.use('/api/admin', Routes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
