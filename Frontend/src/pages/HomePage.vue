<template>
  <div>
    <!-- Header -->
    <Navbar/>
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
      <img :src="Homepagepic" alt="Cooking Illustration" class="feature-image" />
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
import Homepagepic from "@/assets/Homepagepic.png";
import Navbar from "../components/Navbar.vue";

export default {
  name: "HomePage",
  components: {
    Navbar,
  },
  data() {
    return {
      Homepagepic,
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

/* Hero Section */
.hero {
  position: relative;
  text-align: center;
  padding: 6rem 2rem; /* Adjust padding for better spacing */
  background-image: url("@/assets/background-image.png"); /* Use correct image path */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff; /* Text color remains white for contrast */
}

.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Dark overlay with opacity */
  z-index: 1; /* Overlay below the text */
}

.hero-content {
  position: relative;
  z-index: 2; /* Bring text above the overlay */
  max-width: 800px; /* Limit the width of the content */
  margin: 0 auto; /* Center content horizontally */
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem; /* Adjust font size */
  margin-bottom: 1rem;
  font-weight: bold; /* Enhance text readability */
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
  transition: all 0.3s ease-in-out;
}

.hero-button:hover {
  background-color: darkorange;
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
