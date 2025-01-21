  <template>
  <div class="recipes-page">
    <!-- navbar component -->
    <div class="sectionHeading">
      <h1>Recipes</h1>
    </div>
    <!-- filter ad searchcomes here -->
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
      defaultImage: "https://via.placeholder.com/150", // Fallback image
    };
  },
  methods: {
    async fetchRecipes() {
      try {
        const response = await axios.get("/recipes");
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

</style>
