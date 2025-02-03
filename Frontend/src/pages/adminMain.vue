<template>
<div><Navbar/>
  <div class="admin-dashboard">
    <h1>Hello Admin! Manage Users</h1>
    <table v-if="users.length">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="deleteUser(user._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No users found.</p>
  </div>
  </div>
</template>
 
<script>
import { userMangementClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
 
export default {
  name: "adminMain",
  components: {
    Navbar,
  },
  data() {
    return { users: [] };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await userMangementClient.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users.");
      }
    },
    async deleteUser(userId) {
      if (!confirm("Are you sure you want to delete this user?")) return;
 
      try {
        const token = localStorage.getItem("authToken");
        await userMangementClient.delete(`/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
 
        // Update UI after deleting
        this.users = this.users.filter(user => user._id !== userId);
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    },
  },
};
</script>