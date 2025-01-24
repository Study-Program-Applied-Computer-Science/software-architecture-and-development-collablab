<template>
    <header class="header">
      <div class="container">
        <div class="logo">LogoHere</div>
        <nav>
          <ul class="nav-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/recipes">Recipes</router-link></li>
            <li><router-link to="/smartpantry">Smart Pantry</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
          </ul>
        </nav>
        <router-link to="/login" class="sign-in-button">Sign In</router-link>
      </div>
    </header>
</template>
<script>
export default {
  name: "NavbarComponent",
  
  
};
</script>
<style>
.header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-links li {
  margin: 0 1rem;
}
.nav-links a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
}
.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: white;
  background-color: orange;
  border-radius: 5px;
  font-weight: bold;
}

.button.outline {
  background: none;
  color: orange;
  border: 2px solid orange;
}
.sign-in-button {
  padding: 0.5rem 1rem;
  background-color: orange;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
</style>