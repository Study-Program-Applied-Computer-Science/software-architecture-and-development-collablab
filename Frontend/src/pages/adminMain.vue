<template>
<div>
<!-- Navbar -->
<Navbar />
 
    <!-- Manage Users Section -->
<section class="admin-main">
<h1>Manage Users</h1>
<table class="user-table">
<thead>
<tr>
<th>Username</th>
<th>Email</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<tr v-for="user in users" :key="user._id">
<td>{{ user.username }}</td>
<td>{{ user.email }}</td>
<td>
<button class="delete-button" @click="deleteUser(user._id)">Delete</button>
</td>
</tr>
</tbody>
</table>
</section>
 
    <!-- Footer -->
<footer class="footer">
<div class="footer-content">
<p>Recipe Management System</p>
<ul class="social-links">
<li><a href="#">Discord</a></li>
<li><a href="#">GitHub</a></li>
<li><a href="#">Twitter</a></li>
</ul>
<ul class="footer-links">
<li><a href="#">About Us</a></li>
<li><a href="#">Contact Us</a></li>
<li><a href="#">Privacy Policy</a></li>
<li><a href="#">Terms of Use</a></li>
</ul>
<p>Copyright 2024. All rights reserved.</p>
</div>
</footer>
</div>
</template>
 
<script>
import Navbar from "../components/Navbar.vue";
import { apiClient } from "../api";
 
export default {
  name: "AdminMain",
  components: {
    Navbar,
  },
  data() {
    return {
      users: [], // Store list of users
    };
  },
  methods: {
    async fetchUsers() {
      try {
        // Fetch all users
        const response = await apiClient.get("/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token from local storage
          },
        });
        this.users = response.data; // Set the users in the table
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    },
    async deleteUser(userId) {
      try {
        // Delete a specific user
        await apiClient.delete(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for auth
          },
        });
        this.users = this.users.filter((user) => user._id !== userId); // Remove deleted user from list
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Fetch users on component load
  },
};
</script>
 
<style scoped>
/* Admin Main Section */
.admin-main {
  padding: 2rem;
  text-align: center;
}
 
.admin-main h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}
 
/* User Table */
.user-table {
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
 
.user-table th,
.user-table td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #ddd;
}
 
.user-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
 
.user-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
 
.user-table tr:hover {
  background-color: #f1f1f1;
}
 
/* Delete Button */
.delete-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
 
.delete-button:hover {
  background-color: #d9363e;
}
 
/* Footer */
.footer {
  background-color: #333;
  color: #fff;
  padding: 2rem;
  text-align: center;
}
 
.footer-content ul {
  list-style: none;
  padding: 0;
}
 
.footer-content ul li {
  display: inline-block;
  margin: 0 1rem;
}
 
.footer-content ul li a {
  color: #fff;
  text-decoration: none;
}
</style>