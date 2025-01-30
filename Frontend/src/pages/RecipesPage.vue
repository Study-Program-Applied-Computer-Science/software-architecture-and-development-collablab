<template>
  <div class="recipes-page">
    <Navbar/>
    <div class="sectionHeading">
      <h1>Recipes</h1>
    </div>
    <div class="filters">
      <select v-model="selectedCategory" @change="fetchRecipes">
        <option value="">All Categories</option>
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
        <option>Dessert</option>
        <option>Snack</option>
      </select>

      <input
        type="text"
        v-model="searchQuery"
        @input="fetchRecipes"
        placeholder="Search recipes by title"
      />
    </div>
    <div class="product-grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
      />
    </div>
  </div> 
</template>

<script>
import { apiClient } from "@/api/index";
import RecipeCard from "../components/RecipeCard.vue";

import Navbar from "../components/Navbar.vue";
export default {
  name: "RecipesPage",
  components: {
    RecipeCard,
    Navbar,
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

        const response = await apiClient.get("/recipes", { params });
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
.sectionHeading {
  text-align: center;
  padding: 1rem;
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-evenly;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
select,
input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
