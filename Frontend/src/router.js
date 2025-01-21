import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import SmartPantry from "./pages/SmartPantry.vue";
import CreateRecipeform from "./pages/CreateRecipeform.vue";
import RecipesPage from "./pages/RecipesPage.vue";
import  UserProfile from "./pages/UserProfile.vue";
import UserAuth from "./pages/UserAuth.vue";


const routes= [
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
  {
    path: "/profile",
    name: "profile",
    component: UserProfile,
  },
  {
      path: "/login",
      name: "login",
      component: UserAuth,
    },
    {
      path: "/recipeform",
      name: "recipeform",
      component: CreateRecipeform,
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
