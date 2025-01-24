<template>
  <div class="smart-pantry">
    <h1>Smart Pantry</h1>
    <p>Add the only ingredients you have and find recipes you can make!</p> &nbsp;

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
      </div> <br>
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
          :showViewMore="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";
import axios from "axios";

export default {
  name: "SmartPantry",
  components: {
    RecipeCard,
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
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/recipes/search-by-ingredients`,
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
.smart-pantry {
  text-align: center;
  margin: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
</style>
