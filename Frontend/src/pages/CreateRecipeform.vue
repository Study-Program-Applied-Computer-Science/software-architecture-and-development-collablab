<template>
  <div class="add-recipe">
    <h1>Add a New Recipe</h1>
    <form @submit.prevent="submitRecipe">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="recipe.title" id="title" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="recipe.description" id="description" required></textarea>
      </div>

      <div class="form-group">
        <label for="servings">Servings</label>
        <input type="text" v-model="recipe.servings" id="servings" required />
      </div>

      <div class="form-group">
        <label for="prepTime">Preparation Time (minutes)</label>
        <input type="number" v-model="recipe.prepTime" id="prepTime" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select v-model="recipe.category" id="category" required>
          <option disabled value="">Select a category</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Dessert</option>
          <option>Snack</option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients (comma-separated)</label>
        <input type="text" v-model="recipe.ingredients" id="ingredients" required />
      </div>

      <div class="form-group">
        <label for="instructions">Instructions</label>
        <textarea v-model="recipe.instructions" id="instructions" required></textarea>
      </div>

      <div class="form-group">
        <label for="imageUrl">Image URL</label>
        <input type="text" v-model="recipe.imageUrl" id="imageUrl" />
      </div>

      <button type="submit">Add Recipe</button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/index";

export default {
  name: "CreateRecipeform",
  data() {
    return {
      recipe: {
        title: "",
        description: "",
        servings: "",
        prepTime: 0,
        category: "",
        ingredients: "",
        instructions: "",
        imageUrl: "",
      },
    };
  },
  methods: {
    async submitRecipe() {
      try {
        const recipeData = {
          ...this.recipe,
          ingredients: this.recipe.ingredients.split(",").map((item) => item.trim()), // Split ingredients by commas
        };
        const response = await axios.post("/recipes", recipeData);
        console.log("Recipe added successfully:", response.data);
        alert("Recipe added successfully!");
        this.$router.push("/"); // Redirect to the recipes page
      } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.add-recipe {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input,
textarea,
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
