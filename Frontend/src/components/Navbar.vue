<template>
  <header class="header">
    <div class="container">
           <div class="logo1">
        <router-link to="/">
          <img src="@/assets/logo1.png" alt="Cooking Assistant Logo" class="logo1-image" />
        </router-link>
      </div>

      <!-- Navigation Links -->
      <nav>
        <ul class="nav-links">
          <li>
            <router-link 
              to="/" 
              :class="{ active: $route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link 
              to="/recipes" 
              :class="{ active: $route.path === '/recipes' }"
            >
              Recipes
            </router-link>
          </li>
          <li>
            <router-link 
              to="/smartpantry" 
              :class="{ active: $route.path === '/smartpantry' }"
            >
              Smart Pantry
            </router-link>
          </li>
          <li>
            <router-link 
              to="/recipeform" 
              :class="{ active: $route.path === '/recipeform' }"
            >
              Create Recipe
            </router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'user'">
            <router-link 
              to="/profile" 
              :class="{ active: $route.path === '/profile' }"
            >
              Profile
            </router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link 
              to="/admin" 
              :class="{ active: $route.path === '/admin' }"
            >
              Manage Users
            </router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link 
              to="/adminanalytics" 
              :class="{ active: $route.path === '/adminanalytics' }"
            >
              Analytics
            </router-link>
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

.logo1 {
  display: flex;
  align-items: center;
}

.logo1-image {
  height: 55px; 
  width: auto; 
  object-fit: contain; 
  cursor: pointer; 
}



.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem; 
}

.nav-links li {
  margin: 0;
}

.nav-links a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
  padding: 0.5rem 1rem; 
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #ff8c00; 
}

.sign-in-button,
.sign-out-button {
  padding: 0.5rem 1.5rem; 
  border-radius: 5px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sign-in-button {
  background-color: #ff8c00;
  color: white;
  border: none;
}

.sign-in-button:hover {
  background-color: #e67600; 
}

.sign-out-button {
  background: orange;
  color: white;
  border: 2px solid #ff8c00;
}

.sign-out-button:hover {
  background-color:orange;
  color: none;
}


body {
  margin: 0;
  padding-top: 80px; 
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem; 
  }


  .sign-in-button,
  .sign-out-button {
    margin-top: 1rem; 
  }
}
.nav-links a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.nav-links a.active {
  color: orange; 
  font-weight: bold; 
  border-bottom: 2px solid orange; 
}

.nav-links a:hover {
  color:orange; 
}

</style>
