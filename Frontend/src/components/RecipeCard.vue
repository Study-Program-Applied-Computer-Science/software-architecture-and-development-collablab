<template>
  <div class="product-card">
    <img 
      :src="recipe.imageUrl ? `http://localhost:5000${recipe.imageUrl}` : defaultImage" 
      alt="Recipe Image" 
      class="product-image" 
    />
    <h3 class="product-name">{{ recipe.title }}</h3>
    <p class="product-description">{{ recipe.category }}</p>
    <p class="product-description">{{ recipe.prepTime }} min</p>
    <p class="product-description">{{ recipe.description }}</p>

    <div class="buttonDiv">
      <button v-if="mode === 'recipes'" class="view-more-btn" @click="viewRecipe(recipe._id)">
        View More
      </button>
      
      <button v-if="mode === 'profile'" class="edit-btn" @click="$emit('edit', recipe._id)">
        Edit
      </button>
      
      <button v-if="mode === 'profile'" class="delete-btn" @click="$emit('delete', recipe._id)">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      default: "recipes", // Default mode is "recipes" (View More button)
    },
  },
  data() {
    return {
      defaultImage: "https://via.placeholder.com/150",
    };
  },
  methods: {
    viewRecipe(recipeId) {
      this.$router.push(`/recipes/${recipeId}`);
    },
  },
};
</script>

<style scoped>
.product-card {
  width: 250px;
  margin: 10px;
  border: 1px solid #E67E00;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 14px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-image {
  width: 100%;
  max-width: 20rem;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 4px 0;
  color: #333;
}

.product-description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

.buttonDiv {
  text-align: center;
}

.view-more-btn, .edit-btn, .delete-btn {
  background-color: #CC7000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;
}

.view-more-btn:hover {
  background-color: #733f00;
}
.edit-btn {
  background-color: #007bff;
}
.delete-btn {
  background-color: red;
}
</style>
