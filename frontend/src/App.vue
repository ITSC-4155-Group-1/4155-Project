<script setup>
  import NavBar from "./components/NavBar.vue";
  import FooterComponent from "./components/FooterComponent.vue";
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBar /> <!-- user is not logged in, will need a prop or something to the navbar change -->
      <RouterView />
    <FooterComponent />
  </div>
</template>

<style></style>
