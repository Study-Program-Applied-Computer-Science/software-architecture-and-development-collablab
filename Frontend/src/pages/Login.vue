<template>
  <div class="auth-container">
    <!-- Left Section with Image -->
    <div class="auth-image">
      <img src="../assets/signin.png" alt="Login Illustration" />
    </div>

    <!-- Right Section with Login Form -->
    <div class="auth-form-container">
      <div class="auth-form">
        <div class="form-header">
          <router-link to="/">
            <img src="../assets/back.png" alt="Back Arrow" />
          </router-link>
          <h2>Login</h2>
        </div>

        <form class="formWidth" @submit.prevent="login">
          <!-- Username Field -->
          <div class="form-group">
            <input type="text" v-model="username" placeholder="Username" required />
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <input type="password" v-model="password" placeholder="Password" required />
          </div>

          <!-- Login Button -->
          <button type="submit">Login</button>
        </form>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <!-- Footer -->
        <p>
          Don't have an account?
          <router-link to="/signup">Sign Up Now!</router-link>
        </p>
      </div>
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
      this.errorMessage = ""; // Clear previous errors

      try {
        const response = await authClient.post("/login", {
          username: this.username,
          password: this.password,
        });

        if (!response.data.token) {
          throw new Error("⚠️ No token received.");
        }

        console.log("✅ Login successful:", response.data);

        // ✅ Store token correctly
        localStorage.setItem("authToken", response.data.token);

        // ✅ Decode JWT token
        const decodedToken = jwtDecode(response.data.token);
        const userRole = decodedToken.user.role;
        localStorage.setItem("userRole", userRole);

        console.log("🔐 User role:", userRole);

        // ✅ Redirect based on user role
        if (userRole === "admin") {
          this.$router.push("/adminanalytics");
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("❌ Login failed:", error.response?.data || error);
        this.errorMessage =
          error.response?.data?.msg || "Login failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Left Section */
.auth-image {
  flex: 1;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-image img {
  max-width: 80%;
  height: auto;
  object-fit: contain;
}
.formWidth {
  width: 100%;
}

/* Right Section */
.auth-form-container {
  flex: 1;
  background-color: #f3c5b6;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form Styling */
.auth-form {
  width: 80%;
  max-width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-header img {
  width: 1.1rem;
  height: 1.4rem;
  margin-right: 8px;
  margin-top: 8px;
}

h2 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
  margin-right: 32px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
}

input:focus {
  outline: none;
  border-color: #e67e22;
  box-shadow: 0 0 5px rgba(230, 126, 34, 0.5);
}

button {
  width: 100%;
  background-color: #c23c13;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #a23210;
}

p {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
}

p a {
  color: #c23c13;
  text-decoration: none;
  font-weight: bold;
}

p a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}
</style>
