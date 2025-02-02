const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/Routes");
 
dotenv.config();
 
const app = express();
 
// ✅ Connect to MongoDB directly inside `app.js`
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
 
// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
 
// ✅ Mount user management routes
app.use("/api/user-management", userRoutes);
 
const PORT = process.env.PORT || 5002;
 
app.listen(PORT, () => {
  console.log(`✅ User Management Service running on port ${PORT}`);
});
