<template>
  <div>
    <!-- Navbar is now outside the add-recipe div -->
    <Navbar />
    <div class="add-recipe">
      <div class="form-container">
        <h4 class="form-title">{{ isEditing ? "Edit Recipe" : "Add a New Recipe" }}</h4>
        <form @submit.prevent="submitRecipe" enctype="multipart/form-data" class="recipe-form">
          <div class="form-group">
            <label for="title">Recipe Name</label>
            <input type="text" v-model="recipe.title" id="title" placeholder="Enter recipe name" required />
          </div>

          <div class="form-group">
            <label for="category">Recipe Category</label>
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
            <label for="servings">Servings</label>
            <input type="text" v-model="recipe.servings" id="servings" placeholder="E.g., 2 Persons" required />
          </div>

          <div class="form-group">
            <label for="prepTime">Cooking Time (Minutes)</label>
            <input type="number" v-model="recipe.prepTime" id="prepTime" placeholder="Enter time in minutes" required />
          </div>

          <div class="form-group">
            <label for="ingredients">Recipe Ingredients</label>
            <textarea
              v-model="recipe.ingredients"
              id="ingredients"
              placeholder="Enter ingredients (comma-separated)"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="instructions">Cooking Instructions</label>
            <textarea
              v-model="recipe.instructions"
              id="instructions"
              placeholder="Enter step-by-step instructions"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="description">Recipe Description</label>
            <textarea
              v-model="recipe.description"
              id="description"
              placeholder="Add a brief description of the recipe"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="image">Recipe Image</label>
            <input type="file" @change="handleFileUpload" id="image" />
            <p class="file-name">{{ imageFile?.name || "No file selected" }}</p>
          </div>

          <button type="submit" class="submit-btn">
            {{ isEditing ? "Update Recipe" : "Submit Recipe" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";

export default {
  name: "CreateRecipeForm",
  components: { Navbar },
  data() {
    return {
      isEditing: false,
      recipeId: null,
      recipe: {
        title: "",
        description: "",
        servings: "",
        prepTime: 0,
        category: "",
        ingredients: "",
        instructions: "",
      },
      imageFile: null,
    };
  },
  async mounted() {
    this.recipeId = this.$route.params.id; // Check if there's an ID in the URL
    if (this.recipeId) {
      this.isEditing = true;
      await this.loadRecipeData(); // Fetch existing recipe data
    }
  },
  methods: {
    async loadRecipeData() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await apiClient.get(`/${this.recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recipe = response.data;
        this.recipe.title = recipe.title;
        this.recipe.description = recipe.description;
        this.recipe.servings = recipe.servings;
        this.recipe.prepTime = recipe.prepTime;
        this.recipe.category = recipe.category;
        this.recipe.ingredients = recipe.ingredients.join(", ");
        this.recipe.instructions = recipe.instructions;
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    },
    handleFileUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async submitRecipe() {
      // Logic remains the same
    },
  },
};
</script>

<style scoped>
/* Navbar-specific styles can be added in Navbar.vue if required */

.add-recipe {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.form-container {
  width: 90%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid #E67E00;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.recipe-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.recipe-form .form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
}

input,
textarea,
select {
  font-size: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #ffa500;
  box-shadow: 0px 0px 5px rgba(255, 165, 0, 0.5);
}

.file-name {
  font-size: 0.9rem;
  color: #555;
}

.submit-btn {
  grid-column: span 2; 
  width: 50%; 
  margin: 20px auto 0; 
  background-color: #ffa500;
  color: white;
  font-size: 1.1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.submit-btn:hover {
  background-color: #e69500;
}


</style>
