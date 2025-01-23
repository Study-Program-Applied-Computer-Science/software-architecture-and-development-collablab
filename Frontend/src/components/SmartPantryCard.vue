<template>
    <div class="smart-pantry-card">
      <img :src="recipe.imageUrl" :alt="recipe.name" class="recipe-image" />
      <h3>{{ recipe.name }}</h3>
      <p><strong>Category:</strong> {{ recipe.category }}</p>
      <p><strong>Rating:</strong> {{ recipe.rating || "No ratings yet" }}</p>
      <p><strong>Preparation Time:</strong> {{ recipe.prepTime }} mins</p>
      <button @click="viewRecipe">View Details</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "SmartPantryCard",
    props: {
      recipe: {
        type: Object,
        required: true,
      },
    },
    methods: {
      viewRecipe() {
        // Navigate to the recipe details page
        this.$router.push(`/recipes/${this.recipe._id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .smart-pantry-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    margin: 10px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    transition: transform 0.3s ease;
  }
  
  .smart-pantry-card:hover {
    transform: scale(1.03);
  }
  
  .recipe-image {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #ff6600;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #e65c00;
  }
  </style>
  