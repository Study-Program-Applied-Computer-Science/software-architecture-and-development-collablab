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
      <p>
        Don't have an account? <router-link to="/signup">Signup</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authClient } from "@/api/index";

export default {
    name: "LogIn",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await authClient.post("/login", {
          email: this.username, // Assuming email as login identifier
          password: this.password,
        });
        console.log("Login successful:", response.data);

        // Save token to localStorage or cookie
        localStorage.setItem("authToken", response.data.token);

        // Redirect to home or dashboard
        this.$router.push("/");
      } catch (error) {
        console.error("Login failed:", error.response.data);
      }
    },
  },
};
</script>

<style scoped>
/* Use the same styles as Signup.vue */
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
</style>
