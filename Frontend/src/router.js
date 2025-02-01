import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import SmartPantry from "./pages/SmartPantry.vue";
import CreateRecipeform from "./pages/CreateRecipeform.vue";
import RecipesPage from "./pages/RecipesPage.vue";
import UserProfile from "./pages/UserProfile.vue";
import RecipeDetails from "./pages/RecipeDetails.vue";
import LogIn from "./pages/Login.vue";
import SignUp from "./pages/Signup.vue";
import AdminAnalytics from "./pages/adminAnalytics.vue";
import adminMain from "./components/adminMain.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/smartpantry", name: "smartpantry", component: SmartPantry },
  { path: "/recipes", name: "recipes", component: RecipesPage },
  { path: "/recipes/:id", name: "recipedetails", component: RecipeDetails },
  { 
    path: "/profile", 
    name: "profile", 
    component: UserProfile,
    meta: { requiresAuth: true }, //  User must be logged in to access
  },
  { 
    path: "/recipeform", 
    name: "recipeform", 
    component: CreateRecipeform,
    meta: { requiresAuth: true }, //  Only logged-in users can create recipes
  },
  { path: "/recipeform/:id", name: "editrecipe", component: CreateRecipeform },
  { path: "/login", name: "login", component: LogIn },
  { path: "/signup", name: "signup", component: SignUp },
  { 
    path: "/adminanalytics", 
    name: "adminanalytics", 
    component: AdminAnalytics,
    meta: { requiresAuth: true, requiresAdmin: true }, // Only admins can access
  },
  { 
    path: "/admin", 
    name: "admin", 
    component: adminMain,
    meta: { requiresAuth: true, requiresAdmin: true }, // Only admins can access
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Authentication and Role-Based Access
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  //  Redirect to login if the route requires authentication and user is not logged in
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // Redirect non-admin users trying to access an admin-only page
  if (to.meta.requiresAdmin && userRole !== "admin") {
    return next("/"); // Redirect to home page
  }

  next();
});

export default router;
