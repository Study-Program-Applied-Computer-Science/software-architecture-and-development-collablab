<template>
  <header class="header">
    <div class="container">
      <div class="logo">LogoHere</div>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/recipes">Recipes</router-link></li>
          <li><router-link to="/smartpantry">Smart Pantry</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li><router-link to="/adminAnalytics">Analytics</router-link></li>
        </ul>
      </nav>

      <!-- Conditionally show "Sign In" or "Sign Out" -->
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
export default {
  name: "NavbarComponent",
  data() {
    return {
      isAuthenticated: false, // Tracks if the user is logged in
    };
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem("authToken"); // Check if token exists
      this.isAuthenticated = !!token; // Convert token presence to boolean
    },
    logout() {
      localStorage.removeItem("authToken"); // Remove token
      this.isAuthenticated = false; // Update UI state
      this.$router.push("/login"); // Redirect to login page
    },
  },
  mounted() {
    this.checkAuthStatus(); // Check authentication status when the component loads
  },
  watch: {
    "$route"() {
      this.checkAuthStatus(); // Update authentication state on route changes
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
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.sign-in-button {
  background-color: orange;
  color: white;
}

.sign-out-button {
  background-color: red;
  color: white;
  border: none;
}
</style>
