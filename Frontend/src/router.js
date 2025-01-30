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

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/smartpantry",
    name: "smartpantry",
    component: SmartPantry,
  },
  {
    path: "/recipes",
    name: "recipes",
    component: RecipesPage,
  },
  { path: "/recipes/:id", name: "recipedetails", component: RecipeDetails },
  {
    path: "/profile",
    name: "profile",
    component: UserProfile,
  },
  {
    path: "/recipeform",
    name: "recipeform",
    component: CreateRecipeform,
  },
  {
    path: "/login",
    name: "login",
    component: LogIn,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/adminanalytics",
    name: "adminanalytics",
    component: AdminAnalytics,
    meta: { requiresAuth: true, isAdmin: true }, // Optional: Add guards for admin-only access
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
