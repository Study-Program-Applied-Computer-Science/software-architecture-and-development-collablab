<template>
  <div>
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">LogoHere</div>
        <nav>
          <ul class="nav-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/recipes">Recipes</router-link></li>
            <li><router-link to="/smartpantry">Smart Pantry</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
          </ul>
        </nav>
        <router-link to="/login" class="sign-in-button">Sign In</router-link>
      </div>
    </header>

    <!-- Hero Section -->
     <section class="hero">
    <div class="hero-content">
      <h1>Only got 3 Vegetables? No worries!</h1>
      <p>
        We have got you! Use our smart pantry feature and you will be amazed with recipes you get to make with only what you have. Happy Cooking!
      </p>
      <router-link to="/smartpantry" class="hero-button">Try Smart Pantry</router-link>
    </div>
  </section>

    <!-- Features Section -->
     <section class="features">
    <div class="feature-content">
      <img :src="CookingIllustration" alt="Cooking Illustration" class="feature-image" />
      <div class="feature-text">
        <h2>All in One Recipe Management System For You</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div class="feature-buttons">
          <router-link to="/recipeform" class="button">Create a Recipe</router-link>
          <router-link to="/recipes" class="button outline">Try New Recipes</router-link>
        </div>
      </div>
    </div>
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
import CookingIllustration from "@/assets/cooking-illustration.png";

export default {
  name: "HomePage",
  data() {
    return {
      CookingIllustration,
    };
  },
};
</script>

<style scoped>
.features {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  padding: 2rem;
  box-sizing: border-box;
}

.feature-content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left; /* Align text to the left */
  max-width: 1200px; /* Optional: Limit width of the content */
  gap: 2rem; /* Space between image and text */
}

.feature-image {
  max-width: 300px; /* Adjust as needed */
  height: auto;
}

.feature-text {
  max-width: 600px; /* Limit the width of the text section */
}

.feature-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-text p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.feature-buttons {
  display: flex;
  gap: 1rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: white;
  background-color: orange;
  border-radius: 5px;
  font-weight: bold;
}

.button.outline {
  background: none;
  color: orange;
  border: 2px solid orange;
}
</style>

<style scoped>
/* General styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Header styles */
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
.sign-in-button {
  padding: 0.5rem 1rem;
  background-color: orange;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}
.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.hero-button {
  background-color: orange;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
}

/* Features Section */
.features {
  display: flex;
  padding: 3rem 2rem;
  align-items: center;
}
.feature-content {
  display: flex;
  align-items: center;
}
.feature-image {
  max-width: 40%;
}
.feature-text {
  margin-left: 2rem;
}
.feature-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.feature-text p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
.feature-buttons .button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: white;
  background-color: orange;
  border-radius: 5px;
  margin-right: 1rem;
}
.feature-buttons .button.outline {
  background: none;
  color: orange;
  border: 2px solid orange;
}

/* Footer Section */
.footer {
  background-color: #333;
  color: #fff;
  padding: 2rem;
  text-align: center;
}
.footer-content ul {
  list-style: none;
  padding: 0;
}
.footer-content ul li {
  display: inline-block;
  margin: 0 1rem;
}
.footer-content ul li a {
  color: #fff;
  text-decoration: none;
}
</style>
