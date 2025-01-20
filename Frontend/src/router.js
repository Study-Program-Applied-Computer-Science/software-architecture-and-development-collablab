import Vue from "vue";
import Router from "vue-router";

import HomePage from "./pages/HomePage.vue";
import SmartPantry from "./pages/SmartPantry.vue";
import RecipesPage from "./pages/RecipesPage.vue";
import ProfilePage from "./pagess/ProfilePage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
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
      component: ProfilePage,
    },
  ],
});
