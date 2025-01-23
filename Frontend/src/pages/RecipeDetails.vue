<template>
  <div class="recipe-details">
    <h1>{{ recipe.title }}</h1>
    <img :src="`http://localhost:5000${recipe.imageUrl}`" alt="Recipe Image" />
    <div class="details">
      <p><strong>Category:</strong> {{ recipe.category }}</p>
      <p><strong>Prep Time:</strong> {{ recipe.prepTime }} minutes</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        <li v-for="ingredient in recipe.ingredients" :key="ingredient">
          {{ ingredient }}
        </li>
      </ul>
      <p><strong>Instructions:</strong></p>
      <p>{{ recipe.instructions }}</p>
    </div>
  </div>
</template>

<script>
import axios from "@/api/index";

export default {
    name: "RecipeDetails",
  data() {
    return {
      recipe: {}, // Holds the details of the recipe
      defaultImage: "https://via.placeholder.com/400", // Fallback image
    };
  },
  async created() {
    const recipeId = this.$route.params.id; // Get recipe ID from URL
    try {
      const response = await axios.get(`/recipes/${recipeId}`);
      this.recipe = response.data; // Store recipe data in the component state
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  },
};
</script>

<style scoped>
.recipe-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
.recipe-details img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}
.details {
  text-align: left;
  margin-top: 20px;
}
</style>
