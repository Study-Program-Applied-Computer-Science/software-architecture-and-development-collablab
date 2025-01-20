<template>
    <div class="smart-pantry-container">
      <!-- Header Section -->
      <header class="header">
        <div class="logo">LogoHere</div>
        <nav class="nav">
          <a href="#">Home</a>
          <a href="#">Recipes</a>
          <a href="#">Smart Pantry</a>
          <a href="#">Profile</a>
          <button class="sign-in-btn">Sign In</button>
        </nav>
      </header>
  
      <!-- Main Content -->
      <main class="main-content">
        <h1 class="title">Smart Pantry</h1>
        <p class="subtitle">Add the only ingredients you have with you below</p>
  
        <!-- Ingredients Input Form -->
        <form class="ingredient-form" @submit.prevent="searchRecipes">
          <input type="text" placeholder="Ingredient one" v-model="ingredients[0]" />
          <input type="text" placeholder="Ingredient two" v-model="ingredients[1]" />
          <input type="text" placeholder="Ingredient three" v-model="ingredients[2]" />
          <input type="text" placeholder="Ingredient four" v-model="ingredients[3]" />
          <button type="submit" class="search-btn">Search Recipe</button>
        </form>
  
        <!-- Recipe Results -->
        <section class="recipe-results">
          <h2 class="results-title">Smart Pantry Result:</h2>
          <div class="recipe-cards">
            <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
              <img :src="recipe.image" alt="Recipe Image" />
              <h3 class="recipe-name">{{ recipe.name }}</h3>
              <p class="recipe-category">Category: {{ recipe.category }}</p>
              <p class="recipe-description">{{ recipe.description }}</p>
              <button class="view-more-btn">View More</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ingredients: ["", "", "", ""], // Ingredient inputs
        recipes: [
          {
            id: 1,
            name: "Name of Recipe",
            category: "Category",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            image:
              "https://via.placeholder.com/150", // Placeholder image URL
          },
          {
            id: 2,
            name: "Name of Recipe",
            category: "Category",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            image:
              "https://via.placeholder.com/150", // Placeholder image URL
          },
        ],
      };
    },
    methods: {
      searchRecipes() {
        // This method can handle the search functionality based on ingredients
        console.log("Searching recipes with:", this.ingredients);
      },
    },
  };
  </script>
  
  <style scoped>
  /* General Reset */
  body,
  html {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }
  
  /* Header Styles */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .nav a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
  }
  
  .sign-in-btn {
    padding: 0.5rem 1rem;
    background-color: #ff6b00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* Main Content Styles */
  .main-content {
    text-align: center;
    padding: 2rem;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .subtitle {
    font-size: 1rem;
    color: #555;
    margin-bottom: 2rem;
  }
  
  .ingredient-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .ingredient-form input {
    width: 200px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .search-btn {
    padding: 0.75rem 1.5rem;
    background-color: #ff6b00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* Recipe Results */
  .recipe-results {
    text-align: center;
  }
  
  .results-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .recipe-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .recipe-card {
    width: 250px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;
    background: #fff;
  }
  
  .recipe-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .recipe-name {
    font-size: 1.2rem;
    margin: 0.5rem;
  }
  
  .recipe-category,
  .recipe-description {
    font-size: 0.9rem;
    margin: 0.5rem;
    color: #555;
  }
  
  .view-more-btn {
    display: block;
    width: calc(100% - 1rem);
    margin: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    background-color: #ff6b00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  