<template>
  <div>
    <!-- Header -->
    <Navbar/>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>Recipe Management System</p>
        <ul class="social-links">
          <li><a href="#">Discord</a></li>
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
        </ul>
        <ul class="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul>
        <p>Copyright 2024. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";

export default {
  name: "adminMain",
  components: {
    Navbar,
  },
};
</script>


<style>

</style>
