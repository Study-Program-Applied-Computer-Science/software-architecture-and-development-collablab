<template>
  <div>
    <Navbar />
    <div class="recipe-details">
      <div class="image-container">
        <img :src="recipe.imageUrl ? `http://localhost:5000${recipe.imageUrl}` : defaultImage" alt="Recipe Image" />
      </div>

      <div class="info-container">
        <div class="recipe-info">
          <h2>{{ recipe.title }}</h2>
          <p><strong>Recipe Category:</strong> {{ recipe.category }}</p>
          <p><strong>Servings:</strong> {{ recipe.servings }} Persons</p>
          <p><strong>Cooking Time:</strong> {{ recipe.prepTime }} Minutes</p>
        </div>
        <div class="description">
          <h3>Item Description</h3>
          <p>{{ recipe.description }}</p>
        </div>
      </div>

      <div class="details-container">
        <div class="ingredients">
          <h3>Recipe Ingredients</h3>
          <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient">
              {{ ingredient }}
            </li>
          </ul>
        </div>
        <div class="instructions">
          <h3>Cooking Instructions</h3>
          <p>{{ recipe.instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "RecipeDetails",
  components: { Navbar },

  data() {
    return {
      recipe: {},
      defaultImage: "https://via.placeholder.com/400",
      user: null, // Stores user information
    };
  },

  async created() {
    const router = useRouter();

    // Retrieve JWT Token and Decode User
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚫 Access denied: Please log in to view recipes");
      router.push("/login"); // Redirect to login
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      this.user = payload.user;

      if (!this.user?.id) {
        console.error("🚫 Invalid token, please log in again");
        router.push("/login");
        return;
      }
    } catch (error) {
      console.error("🚫 Invalid token format");
      router.push("/login");
      return;
    }

    // Retrieve Recipe ID from URL
    const recipeId = this.$route.params.id;
    if (!recipeId) {
      console.error("❌ Missing recipe ID");
      return;
    }

    try {
      // Fetch Recipe Details
      const response = await apiClient.get(`/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.recipe = response.data;

      // Log the Recipe View
      this.logRecipeView(recipeId);
    } catch (error) {
      console.error("❌ Error fetching recipe details:", error.response?.data || error);
    }
  },

  methods: {
    async logRecipeView(recipeId) {
      if (!this.user || !this.user.id) {
        console.error("❌ Cannot log view, user is not authenticated");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5003/api/analytics/log-view",
          { recipeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Successfully logged view:", response.data);
      } catch (error) {
        console.error("❌ Failed to log view:", error.response?.data || error);
      }
    }
  }
};
</script>
