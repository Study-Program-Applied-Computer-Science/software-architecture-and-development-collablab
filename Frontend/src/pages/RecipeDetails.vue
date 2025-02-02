<template>
  <div>
    <Navbar />
    <div class="recipe-details">
      <!-- Recipe Image -->
      <div class="image-container">
        <img :src="recipe.imageUrl ? `http://localhost:5000${recipe.imageUrl}` : defaultImage" alt="Recipe Image" />
      </div>
 
      <!-- Recipe Information -->
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
 
      <!-- Recipe Ingredients and Instructions -->
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
import { apiClient, analyticsClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
 
 
export default {
  name: "RecipeDetails",
  components: { Navbar },
 
  data() {
    return {
      recipe: {},
      defaultImage: "https://via.placeholder.com/400",
    };
  },
 
  async created() {
    // Retrieve recipeId from URL
    const recipeId = this.$route.params.id;
    if (!recipeId) {
      console.error("Missing recipe ID");
      return;
    }
 
    try {
      // Fetch Recipe Details
      const response = await apiClient.get(`/${recipeId}`);
      this.recipe = response.data;
 
      // Plan-1 if user doesnot exist we can use this dummy user
      this.setupDummyUser();
 
      // Here it logs recipie views
      this.logRecipeView(recipeId);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  },
 
  methods: {
    setupDummyUser() {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        const dummyUsers = ["user123", "user456", "user789"];
        userId = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        localStorage.setItem("userId", userId);
        console.log("Assigned Dummy User ID:", userId);
      }
    },
 
    async logRecipeView(recipeId) {
  const userId = localStorage.getItem("userId") || "guest";
 
  console.log("🔍 Logging Recipe View:", { recipeId, userId });
 
  if (!recipeId || !userId) {
    console.error("Cannot log view, missing recipeId or userId");
    return;
  }
  try {
    const response = await analyticsClient.post("/log-view", {
      recipeId,
      userId,
    });
 
    console.log("Successfully logged view:", response.data);
  } catch (error) {
    console.error("Failed to log view:", error.response?.data || error);
  }
}
  }
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