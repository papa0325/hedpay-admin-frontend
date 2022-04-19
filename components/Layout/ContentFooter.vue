<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a
            target="_blank"
            rel="noopener"
            class="nav-link"
          />
        </li>
        <li class="nav-item">
          <a
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            About Us
          </a>
        </li>
        <li class="nav-item">
          <a
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            Blog
          </a>
        </li>
      </ul>
      <div class="copyright">
        &copy; {{ year }}, made with <i class="tim-icons icon-heart-2" /> by
        <a
          href="https://binarcode.com"
          rel="noopener"
          target="_blank"
        >BinarCode</a> and
        <a
          target="_blank"
          rel="noopener"
        />
        for a better web.
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
<style></style>
