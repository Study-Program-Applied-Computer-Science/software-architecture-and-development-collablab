<template>
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
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background-color: rgba(89, 49,0, 1);
  color: #fff;
  padding: 2rem;
  text-align: center;
}

.footer-content ul {
  list-style: none;
  padding: 0;
}

.footer-content ul li {
  display: inline-block;
  margin: 0 1rem;
}

.footer-content ul li a {
  color: #fff;
  text-decoration: none;
}

.footer-content p {
  margin: 0.5rem 0;
}
</style>
