<template>
<div class="page-container">
  <!-- Navbar -->
  <Navbar />

  <!-- Main Content -->
  <div class="smart-pantry">
    <h1>Smart Pantry</h1>
    <p>Add the only ingredients you have and find recipes you can make!</p>

    <form @submit.prevent="searchRecipes">
      <div class="ingredients-input">
        <div
          v-for="(ingredient, index) in ingredients"
          :key="index"
          class="ingredient-container"
        >
          <input
            type="text"
            v-model="ingredients[index]"
            placeholder="Enter ingredient"
            class="ingredient-input"
          />
          <span
            v-if="ingredients.length > 1"
            class="remove-icon"
            @click="removeIngredientField(index)"
          >
            &times;
          </span>
        </div>
      </div>
      <br />
      <button class="secondryButton" type="button" @click="addIngredientField">Add More Ingredients</button>
      <button class="primaryButton" type="submit">Search Recipes</button>
    </form>

    <div class="recipe-results">
      <h2>Matching Recipes</h2>
      <p v-if="loading">Loading recipes...</p>
      <p v-if="!loading && recipes.length === 0">No recipes found.</p>
      <div v-if="recipes.length > 0" class="results-container">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe._id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>

  <!-- Footer -->
  <Footer />
</div>
</template>


<script>
import RecipeCard from "../components/RecipeCard.vue";
import { apiClient } from "@/api/index";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default {
  name: "SmartPantry",
  components: {
    RecipeCard,
    Navbar,   
    Footer, 
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
    removeIngredientField(index) {
      this.ingredients.splice(index, 1); // Remove the specific ingredient field
    },
    async searchRecipes() {
      this.loading = true;
      try {
        const response = await apiClient.post(
          "/search-by-ingredients",
          {
            ingredients: this.ingredients
              .filter((ingredient) => ingredient.trim() !== "") // Remove empty strings
              .map((ingredient) => ingredient.trim().toLowerCase()), // Normalize input
          }
        );

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
/* Ensure the entire page is filled */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
}

/* Main content should stretch to fill the space between navbar and footer */
.smart-pantry {
  flex: 1; /* Make this section flexible to fill remaining space */
  text-align: center;
  margin: 20px;
}

.ingredients-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ingredient-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 450px;
}

.ingredient-input {
  width: 100%;
  padding: 8px;
  height: 40px;
  border: 1px solid #ff8c00;
  border-radius: 10px;
}

.remove-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  color: #ff0000;
  cursor: pointer;
  user-select: none;
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

/* Footer styling (optional, if not already styled in Footer.vue) */
.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 2rem;
}
</style>
