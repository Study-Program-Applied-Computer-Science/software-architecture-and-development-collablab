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
import { userMangementClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import { apiClient } from "../api";
 
export default {
  name: "AdminMain",
  components: {
    Navbar,
  },
};
</script>


<style>

</style>
