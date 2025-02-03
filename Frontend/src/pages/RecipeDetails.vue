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
          <p><strong>Category:</strong> {{ recipe.category }}</p>
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
          <h3>Ingredients</h3>
          <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient">
              {{ ingredient }}
            </li>
          </ul>
        </div>
        <div class="instructions">
          <h3>Instructions</h3>
          <p>{{ recipe.instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient, analyticsClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";

export default {
  name: "RecipeDetails",
  components: { Navbar },

  data() {
    return {
      recipe: {},
      defaultImage: "https://via.placeholder.com/400",
      viewLogged: false, // ✅ Prevent duplicate logging
    };
  },

  async created() {
    const recipeId = this.$route.params.id;
    if (!recipeId) {
      console.error("❌ Missing recipe ID");
      return;
    }

    try {
      // ✅ Fetch Recipe Details
      const response = await apiClient.get(`/${recipeId}`);
      this.recipe = response.data;

      // ✅ Ensure user is logged in before logging view
      const token = localStorage.getItem("authToken");
      if (token && !this.viewLogged) {
        this.logRecipeView(recipeId, token);
      } else {
        console.warn("⚠️ User not logged in - Skipping view log");
      }
    } catch (error) {
      console.error("❌ Error fetching recipe details:", error);
    }
  },

  methods: {
    async logRecipeView(recipeId, token) {
      try {
        console.log("📌 Logging view for recipe:", recipeId);
        const response = await analyticsClient.post(
          "/log-view",
          { recipeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Successfully logged view:", response.data);

        this.viewLogged = true; // ✅ Prevent multiple logs
      } catch (error) {
        console.error("❌ Failed to log view:", error.response?.data || error);
      }
    },
  },
};
</script>

<style scoped>
.recipe-details {
  max-width: 900px;
  margin: 35px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
  border: 1px solid #E67E00;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
 
.image-container {
  text-align: center;
  margin-bottom: 20px;
}
.image-container img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ddd;
}
 
.info-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.recipe-info {
  width: 45%;
}
.recipe-info h2 {
  margin-bottom: 10px;
  font-size: 24px;
}
.recipe-info p {
  margin: 5px 0;
}
.description {
  width: 45%;
  background: #fef5e6;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.description h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}
 
.details-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.ingredients, .instructions {
  width: 45%;
}
.ingredients h3, .instructions h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}
.ingredients ul {
  list-style: none;
  padding: 0;
}
.ingredients ul li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.instructions p {
  font-size: 14px;
  line-height: 1.5;
}
 
@media (max-width: 768px) {
  .info-container, .details-container {
    flex-direction: column;
  }
  .recipe-info, .description, .ingredients, .instructions {
    width: 100%;
  }
}
</style>
