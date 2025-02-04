<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    <div class="recipes-page">
      <!-- Page Content -->
      <div class="sectionHeading">
        <h1>Recipes</h1>
      </div>
      <div class="search-filter-container">
        <div class="filter-dropdown">
          <select v-model="selectedCategory" @change="fetchRecipes">
            <option value="">All Categories</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Dessert</option>
            <option>Snack</option>
          </select>          
        </div>

        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            @input="fetchRecipes"
            placeholder="Recipe name"
          />
          <button class="search-btn">            
            <img src="@/assets/searchicon.png" alt="search" class="search-icon" />
          </button>
        </div>
      </div>
      <div class="product-grid">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe._id"
          :recipe="recipe"
        />
      </div>
    </div>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import { apiClient } from "@/api/index";
import RecipeCard from "../components/RecipeCard.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "RecipesPage",
  components: {
    RecipeCard,
    Navbar,
    Footer,
  },
  data() {
    return {
      recipes: [],
      selectedCategory: "",
      searchQuery: "",
    };
  },
  methods: {
    async fetchRecipes() {
      try {
        const params = {};
        if (this.selectedCategory) params.category = this.selectedCategory;
        if (this.searchQuery) params.search = this.searchQuery;

        const response = await apiClient.get("/", { params });
        this.recipes = response.data;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
  },
  mounted() {
    this.fetchRecipes();
  },
};
</script>

<style scoped>
.recipes-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the page takes the full viewport height */
  padding: 40px;
}

.sectionHeading {
  text-align: center;
  padding: 1rem;
}

.search-filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; /* Space between dropdown and search bar */
  margin: 30px auto; /* Centered with some margin */
}

.filter-dropdown select {
  padding: 10px;
  border: 1px solid #f6a300; /* Orange border */
  border-radius: 40px;
  font-size: 16px;
  background-color: white;
  outline: none;
  text-align: center;
  width: 178px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center; 
  background-size: 16px 16px;
  color: #333;
  cursor: pointer;
  appearance: none;
  height: 47.2px;
}

.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #f6a300; /* Orange border */
  border-radius: 40px;
  overflow: hidden;
  background-color: white;
  height: 47.2px;
  width: 420px;
}

.search-bar input {
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  outline: none;
  flex: 1; /* Fills the available space */
}

.search-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.search-icon {
  font-size: 18px;
  color: #333;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-evenly;
  flex-grow: 1; /* Pushes the footer down */
}

/* Ensures footer stays at the bottom */
footer {
  margin-top: auto;
}
</style>
