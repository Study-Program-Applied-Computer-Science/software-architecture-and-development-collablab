<template>
  <div class="auth-container">
    <div class="auth-image">
      <img src="../assets/signin.png" alt="Login" />
    </div>
    <div class="auth-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p>
        Don't have an account? <router-link to="/signup">Signup</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authClient } from "@/api/index";
import { jwtDecode } from "jwt-decode";

export default {
    name: "LogIn",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      this.errorMessage = ""; 
      try {
        const response = await authClient.post("/login", {
          username: this.username,
          password: this.password,
        });

        if (response && response.data.token) {
          console.log("Login successful:", response.data);

          // Save token to localStorage
          localStorage.setItem("authToken", response.data.token);
          const decodedToken = jwtDecode(response.data.token); // Ensure correct function usage
          const userRole = decodedToken.user.role;
          localStorage.setItem("userRole", userRole);
          
          alert("Login successful! Redirecting...");
          
          // Redirect to homepage or dashboard
          this.$router.push("/");
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Login failed:", error);
        if (error.response) {
          this.errorMessage = error.response.data.msg || "Login failed. Check your credentials.";
        } else {
          this.errorMessage = "Server error. Please try again later.";
        }
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.auth-image img {
  max-width: 100%;
  height: auto;
}

.auth-form {
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 16px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
