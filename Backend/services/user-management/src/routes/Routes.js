const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// ✅ Middleware to check if the user is an admin

const AUTH_SERVICE_URL = "http://localhost:5002/api/auth"; // Auth Service URL

// Middleware to check if the user is an admin

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Fetch All Users (Admin Only)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Pass JWT token for security
    const response = await axios.get(`${AUTH_SERVICE_URL}/users`, {
      headers: { Authorization: token },
    });

    res.status(200).json(response.data); // Return user data from auth-service
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: "Failed to fetch users" });
  }
});

// // Delete User
// router.delete("/user/:id", authMiddleware, isAdmin, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// ✅ Public: Get All Users (No Authentication)
router.get("/user", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Delete a User
router.delete("/admin/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Edit User
router.put("/admin/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
    
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
});

} catch (error) {  // ✅ Ensure catch block exists
  console.error("Error updating user:", error);
  res.status(500).json({ message: "Internal server error" });
}
}); //

// Admin: Delete a User
router.delete("/admin/user/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization"); // Get token from admin

    // Forward delete request to the Auth Service
    const response = await axios.delete(`${AUTH_SERVICE_URL}/user/${req.params.id}`, {
      headers: { Authorization: token },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: "Failed to delete user" });
  }
});

// ✅ Get a Single User (Authenticated Users Only)
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 }); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});


// Admin deletes a recipe
router.delete("/recipe/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});
 
 
 
 

module.exports = router;


