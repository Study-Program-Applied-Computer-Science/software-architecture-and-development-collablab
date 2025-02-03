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
          Cooking Assistant is your ultimate partner in the kitchen. Discover personalized recipes based on what you have in your pantry, and unleash your creativity with ease. 
          Whether you're trying something new or managing daily meals, we've got you covered!
        </p>
        <div class="feature-buttons">
          <router-link to="/recipeform" class="button">Create a Recipe</router-link>
          <router-link to="/recipes" class="button outline">Try New Recipes</router-link>
        </div>
      </div>
    </div>
  </section>
 <Footer />
  </div>

 
</template>

<script>
import Homepagepic from "@/assets/Homepagepic.png";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "HomePage",
  components: {
    Navbar,
    Footer,
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
  justify-content: space-between; 
  gap: 4rem; 
  padding: 3rem 2rem;
  flex-wrap: wrap; 
}

.feature-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: auto;
  flex-wrap: wrap;
}

.feature-image {
  width: 40%; 
  max-width: 400px;
  height: auto;
  margin-right: 3rem;
}

.feature-text {
  width: 55%; 
  max-width: 500px;
  text-align: left;
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
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}


.feature-buttons .button.outline:hover {
  background-color: orange; 
  color: white; 
}


.button {
  background-color: #ff6600;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
}

.button.outline {
  background-color: transparent;
  border: 2px solid #ff6600;
  color: #ff6600;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .features {
    flex-direction: column;
    text-align: center;
    gap: 2rem; 
  }

  .feature-image,
  .feature-text {
    width: 100%; 
  }

  .feature-image {
    margin-right: 0;
  }

  .feature-text {
    text-align: center; 
  }
}


.hero {
  position: relative;
  text-align: center;
  padding: 4rem 1.5rem; 
  background-image: url("@/assets/background-image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
}

.hero-content {
  max-width: 700px; 
  margin: 0 auto;
}

.hero h1 {
  font-size: 2rem; 
  margin-bottom: 0.8rem; 
}

.hero p {
  font-size: 1.1rem; 
  margin-bottom: 1.5rem; 
}

.hero-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem; 
}
</style>

<style scoped>

body {
  margin: 0;
  font-family: Arial, sans-serif;
}


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
  padding: 6rem 2rem; 
  background-image: url("@/assets/background-image.png"); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff; 
}

.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); 
  z-index: 1; 
}

.hero-content {
  position: relative;
  z-index: 2; 
  max-width: 800px; 
  margin: 0 auto; 
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem; 
  margin-bottom: 1rem;
  font-weight: bold; 
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
  background: white;
  color: orange;
  border: 2px solid orange;
}


</style>
