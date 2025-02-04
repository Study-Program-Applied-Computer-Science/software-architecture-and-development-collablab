<template>
<div class="page-container">
  <Navbar />

  <div class="smart-pantry">
    <h1>Smart Pantry</h1>
    <p>Add the only ingredients you have and find recipes you can make!</p> <br>

    <form @submit.prevent="searchRecipes">
      <div class="ingredients-input">
        <div
          v-for="(ingredient, index) in ingredients"
          :key="index"
          class="ingredient-container"
        >
          <input
            type="text"
            v-model="ingredients[index]"
            placeholder="Enter ingredient"
            class="ingredient-input"
          />
          <span
            v-if="ingredients.length > 1"
            class="remove-icon"
            @click="removeIngredientField(index)"
          >
            &times;
          </span>
        </div>
      </div>
      <br />
      <button class="secondryButton" type="button" @click="addIngredientField">Add More Ingredients</button>
      <button class="primaryButton" type="submit">Search Recipes</button>
    </form>

    <div class="recipe-results">
      <h2>Matching Recipes</h2>
      <p v-if="loading">Loading recipes...</p>
      <p v-if="!loading && recipes.length === 0">No recipes found.</p>
      <div v-if="recipes.length > 0" class="results-container">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe._id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>

  <Footer />
</div>
</template>


<script>
import RecipeCard from "../components/RecipeCard.vue";
import { apiClient } from "@/api/index";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";

export default {
  name: "SmartPantry",
  components: {
    RecipeCard,
    Navbar,   
    Footer, 
  },
  setup() {
    const router = useRouter();
    const ingredients = ref([""]);
    const recipes = ref([]);
    const loading = ref(false);

    //Ensure only logged-in users can access this page
    onMounted(() => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("User not logged in. Redirecting to login...");
        router.push("/login");
        return;
      }

      try {
        const payload = jwtDecode(token);
        console.log("Logged-in User:", payload.user);
      } catch (error) {
        console.error("Invalid token. Logging out user.");
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    });

    // Add Ingredient Field
    const addIngredientField = () => {
      ingredients.value.push("");
    };

    // Remove Ingredient Field
    const removeIngredientField = (index) => {
      ingredients.value.splice(index, 1);
    };

    // Search Recipes (Authenticated Users Only)
    const searchRecipes = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("⚠️ No token found. Redirecting to login.");
          router.push("/login");
          return;
        }

        const response = await apiClient.post(
          "/search-by-ingredients",
          {
            ingredients: ingredients.value
              .filter((ingredient) => ingredient.trim() !== "")
              .map((ingredient) => ingredient.trim().toLowerCase()),
          },
          {
            // Securing API with Auth Token
            headers: { Authorization: `Bearer ${token}` }, 
          }
        );

        if (response.data && response.data.success) {
          recipes.value = response.data.recipes;
        } else {
          recipes.value = [];
        }
      } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error);
        recipes.value = [];
      } finally {
        loading.value = false;
      }
    };

    return {
      ingredients,
      recipes,
      loading,
      addIngredientField,
      removeIngredientField,
      searchRecipes,
    };
  },
};
</script>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.smart-pantry {
  flex: 1;
  text-align: center;
  margin: 20px;
}

.ingredients-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ingredient-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 450px;
}

.ingredient-input {
  width: 100%;
  padding: 8px;
  height: 40px;
  border: 1px solid #ff8c00;
  border-radius: 10px;
}

.remove-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  color: #ff0000;
  cursor: pointer;
  user-select: none;
}

button {
  margin: 10px;
  padding: 10px 25px;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  font-size: 16px;
}

button.primaryButton {
  background-color: #ff8c00;
  color: white;
}

button.secondaryButton {
  background-color: white;
  color: #ff8c00;
  border: 2px solid #FF8C00;
}

.recipe-results {
  margin-top: 20px;
}

.results-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>
