<template>
  <div class="page-container">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="admin-dashboard p-6 flex flex-col items-center justify-center">
      <h1 class="text-4xl font-extrabold mb-2 text-center text-green-700">Hello Admin!</h1>
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-800">Manage Users</h2>
      <div class="w-full max-w-4xl overflow-x-auto shadow-lg rounded-lg">
        <table v-if="users.length" class="min-w-full bg-white">
          <thead>
            <tr class="bg-green-600 text-white text-md leading-normal">
              <th class="py-3 px-6 text-left">Username</th>
              <th class="py-3 px-6 text-left" style="background-color: #D97706;">Email</th>
              <th class="py-3 px-6 text-center">Remove</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm font-light">
            <tr
              v-for="user in users"
              :key="user._id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left whitespace-nowrap font-medium">{{ user.username }}</td>
              <td class="py-3 px-6 text-left">{{ user.email }}</td>
              <td class="py-3 px-6 text-center">
                <button
                  @click="deleteUser(user._id)"
                  class="bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center text-gray-500 mt-4">No users found.</p>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import { userMangementClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "adminMain",
  components: {
    Navbar,
    Footer,
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

        this.users = this.users.filter((user) => user._id !== userId);
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    },
  },
};
</script>

<style scoped>
/* Full-page layout using Flexbox */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Main content takes available space */
.admin-dashboard {
  flex: 1;
  font-family: "Poppins", sans-serif;
}

/* Table styling */
th,
td {
  text-align: left;
  padding: 12px 15px;
}

th {
  background-color: #38a169;
  color: white;
  text-transform: uppercase;
}

th:nth-child(2) {
  background-color: #d97706;
}

button {
  cursor: pointer;
  background-color: #ff0000;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

button:hover {
  background-color: #cc0000;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Responsive design for mobile devices */
@media (min-width: 640px) {
  .admin-dashboard {
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
