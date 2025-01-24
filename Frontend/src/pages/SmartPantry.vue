<template>
<div><Navbar/>
  <div class="smart-pantry">
    <h1>Smart Pantry</h1>
    <p>Add the only ingredients you have and find recipes you can make!</p> &nbsp;

    <form @submit.prevent="searchRecipes">
      <div class="ingredients-input">
        <input
          v-for="(ingredient, index) in ingredients"
          :key="index"
          type="text"
          v-model="ingredients[index]"
          placeholder="Enter ingredient"
          class="ingredient-input"
        />
      </div> <br>
      <button class="secondryButton" type="button" @click="addIngredientField">Add More Ingredients</button>
      <button class="primaryButton" type="submit">Search Recipes</button>
    </form>

    <div class="recipe-results">
      <h2>Matching Recipes</h2>
      <p v-if="loading">Loading recipes...</p>
      <p v-if="!loading && recipes.length === 0">No recipes found.</p>
      <div v-if="recipes.length > 0" class="results-container">
        <!-- Always show the View More button -->
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe._id"
          :recipe="recipe"
          :showViewMore="true" 
        />
      </div>
    </div>
  </div></div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";
import axios from "axios";
import Navbar from "../components/Navbar"

export default {
  name: "SmartPantry",
  components: {
    RecipeCard,
    Navbar,    
  },
  data() {
    return {
      ingredients: [""], // Start with one input field
      recipes: [],
      loading: false,
    };
  },
  methods: {
    addIngredientField() {
      this.ingredients.push("");
    },
    async searchRecipes() {
      this.loading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/recipes/search-by-ingredients`, {
          ingredients: this.ingredients
            .filter((ingredient) => ingredient.trim() !== "") // Remove empty strings
            .map((ingredient) => ingredient.trim().toLowerCase()), // Normalize input
        });

        if (response.data && response.data.success) {
          this.recipes = response.data.recipes;
        } else {
          this.recipes = [];
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        this.recipes = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.smart-pantry {
  text-align: center;
  margin: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.ingredients-input input {
  display: block;
  margin: 5px auto;
  padding: 8px;
  width: 450px;
  height: 40px;
}

button {
  margin: 10px;
  padding: 10px 25px;
  cursor: pointer;
  border-radius: 10px; /* Rounded corners */
  border: none;
  font-size: 16px;
}

button.primaryButton {
  background-color: #ff8c00;
  color: white;
}

button.secondryButton {
  background-color: white;
  color: #ff8c00;
  border: 2px solid #FF8C00;
}



.recipe-results {
  margin-top: 20px;
}

.results-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>
