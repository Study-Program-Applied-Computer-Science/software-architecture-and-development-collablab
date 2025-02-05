<template>
  <div class="auth-container">
    <!-- Left Section with Image -->
    <div class="auth-image">
      <img src="../assets/signup.png" alt="Signup Illustration" />
    </div>

    <!-- Right Section with Signup Form -->
    <div class="auth-form-container">
      <div class="auth-form">
        <div class="form-header">
          <router-link to="/">
            <img src="../assets/back.png" alt="Signup Illustration" />
          </router-link>
          <h2>Sign Up</h2>
        </div>

        <form class="formWidth" @submit.prevent="signup">
          <!-- Email Field -->
          <div class="form-group">
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="E-mail"
              required
            />
          </div>

          <!-- Username Field -->
          <div class="form-group">
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Username"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Password"
              required
            />
          </div>

          <!-- Signup Button -->
          <button type="submit">Sign Up</button>
        </form>

        <!-- Footer -->
        <p>
          Already have an account?
          <router-link to="/login">Sign In Now!</router-link>
        </p>
      </div>
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
          this.errorMessage =
            error.response.data.msg || "Signup failed. Please try again.";
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
.formWidth{
  width: 100%;
}
.auth-image img {
  max-width: 80%;
  height: auto;
  object-fit: contain;
}

/* Right Section */
.auth-form-container {
  flex: 1;
  background-color: #ffe6cc; 
  display: flex;
  justify-content: center;
  align-items: center;
}


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
  background-color: #e67e22; /* Orange */
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #d35400; 
}

p {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  margin-left: 9%;
}

p a {
  color: #e67e22;
  text-decoration: none;
  font-weight: bold;
}

p a:hover {
  text-decoration: underline;
}
</style>
