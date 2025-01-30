<template>
  <div class="auth-container">
    <div class="auth-image">
      <img src="../assets/signup.png" alt="Signup" />
    </div>
    <div class="auth-form">
      <h2>Signup</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p>
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authClient } from "@/api/index";

export default {
    name: "SignUp",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async signup() {
      this.errorMessage = ""; // Clear previous errors
      try {
        const response = await authClient.post("/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if (response && response.data) {
          console.log("Signup successful:", response.data);
          alert("Signup successful! Redirecting to login...");
          this.$router.push("/login"); // Redirect to login page
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Signup failed:", error);
        if (error.response) {
          this.errorMessage = error.response.data.msg || "Signup failed. Please try again.";
        } else {
          this.errorMessage = "Server error. Please check your connection.";
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
