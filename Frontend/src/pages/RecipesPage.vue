  <template>
  <div class="recipes-page">
    <!-- navbar component -->
    <div class="sectionHeading">
      <h1>Recipes</h1>
    </div>
    <!-- Filters Section -->
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
    <!-- footer -->
  </div> 
</template>

<script>
import axios from "@/api/index"; // Axios instance for API requests
import RecipeCard from "../components/RecipeCard.vue";
export default {
  name: "RecipesPage",
  components: {
    RecipeCard,
  },
  data() {
    return {
      recipes: [],
      selectedCategory: "", // Stores the selected category
      searchQuery: "", // Stores the search input
      defaultImage: "https://via.placeholder.com/150", // Fallback image
    };
  },
  methods: {
    async fetchRecipes() {
      try {
        const params = {};
        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }
        if (this.searchQuery) {
          params.search = this.searchQuery;
        }

        const response = await axios.get("/recipes", { params });
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
.sectionHeading{
    text-align: center;
    padding: 1rem;
}
  .product-grid {
  display: flex;
  flex-wrap: wrap; 
  gap: 20px;
  justify-content: space-evenly;
  margin-left: 6rem;
  margin-right: 6rem;
  margin-bottom: 3rem;
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
