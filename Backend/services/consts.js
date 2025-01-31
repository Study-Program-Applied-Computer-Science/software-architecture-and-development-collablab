const AUTH_SERVICE = "http://localhost:5002/api/auth/login";

const ANALYTICS_SERVICE = "http://localhost:5003/api/analytics";

const RECIPE_SERVICE = "http://localhost:5000/api/recipes";

const USER_SERVICE = "http://localhost:5001/api/user/";

// roles.js
const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  AUTH_SERVICE: "auth_service",
});

module.exports = {
  AUTH_SERVICE,
  ANALYTICS_SERVICE,
  RECIPE_SERVICE,
  USER_SERVICE,
  ROLES,
};
