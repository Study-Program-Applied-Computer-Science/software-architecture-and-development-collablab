<template>
  <header class="header">
    <div class="container">
      <div class="logo">LogoHere</div>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/recipes">Recipes</router-link></li>
          <li><router-link to="/smartpantry">Smart Pantry</router-link></li>
          <li><router-link to="/recipeform">Create Recipe</router-link></li>
          <li v-if="isAuthenticated && userRole === 'user'">
            <router-link to="/profile">Profile</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link to="/admin">Manage Users</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link to="/adminanalytics">Analytics</router-link>
          </li>
        </ul>
      </nav>

      <!-- Sign In / Sign Out Button -->
      <button v-if="isAuthenticated" @click="logout" class="sign-out-button">
        Sign Out
      </button>
      <router-link v-else to="/login" class="sign-in-button">
        Sign In
      </router-link>
    </div>
  </header>
</template>

<script>
import { jwtDecode } from "jwt-decode";

export default {
  name: "NavbarComponent",
  data() {
    return {
      isAuthenticated: false,
      userRole: null,
    };
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem("authToken");
      this.isAuthenticated = !!token;

      if (token) {
        const decodedToken = jwtDecode(token);
        this.userRole = decodedToken.user.role;
      }
    },
    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      this.isAuthenticated = false;
      this.userRole = null;
      this.$router.push("/login");
    },
  },
  mounted() {
    this.checkAuthStatus();
  },
  watch: {
    $route() {
      this.checkAuthStatus();
    },
  },
};
</script>
<style scoped>
.header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-links li {
  margin: 0 1rem;
}
.nav-links a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
}
.sign-in-button,
.sign-out-button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: normal;
  text-decoration: none;
  cursor: pointer;
}

.sign-in-button {
  background-color: #ff8c00;
  color: white;
}

.sign-out-button {
  background: none;
  color: #ff8c00;
  border: 2px solid #ff8c00;
}
</style>
