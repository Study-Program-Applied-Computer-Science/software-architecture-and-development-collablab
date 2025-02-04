<template>
<div>
 <Navbar/>
  <div class="profile-container">
    <h1>My Recipes</h1>
    <div v-if="recipes.length > 0" class="recipe-list">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
        :mode="'profile'"
        @edit="editRecipe"
        @delete="deleteRecipe"
      />
    </div>
    <p v-else>No recipes found.</p>
  </div>
  <!-- Footer -->
  <Footer />
  </div>
</template>

<script>
import { apiClient } from "@/api/index";
import RecipeCard from "@/components/RecipeCard.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "UserProfile",
  components: { RecipeCard, Navbar, Footer },
  data() {
    return {
      recipes: [],
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter recipes to show only the logged-in user's recipes
      const userId = this.getUserIdFromToken(token);
      this.recipes = response.data.filter(recipe => recipe.userId === userId);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  },
  methods: {
    getUserIdFromToken(token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user.id;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    },
    editRecipe(recipeId) {
      this.$router.push(`/recipeform/${recipeId}`);
    },
    async updateRecipeInState(updatedRecipe) {
    const index = this.recipes.findIndex(recipe => recipe._id === updatedRecipe._id);
    if (index !== -1) {
      this.recipes.splice(index, 1, updatedRecipe); // Update UI state
    }
  },
    async deleteRecipe(recipeId) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("You must be logged in to delete a recipe.");
        return;
      }

      await apiClient.delete(`/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
      });

      this.recipes = this.recipes.filter(recipe => recipe._id !== recipeId);
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert(error.response?.data?.message || "Failed to delete recipe.");
    }
  }
}
,
  },
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  text-align: center;
}
.recipe-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
}
</style>
