<script setup>
    import NavBar from "./components/NavBar.vue";
    import FooterComponent from "./components/FooterComponent.vue";
    import { ref, onMounted } from 'vue';

    const navHeight = ref(86);

    onMounted(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navHeight.value = navbar.offsetHeight;
        }
    });
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBar /> <!-- user is not logged in, will need a prop or something to the navbar change -->
      <RouterView :style="{ marginTop: navHeight + 'px' }"/>
    <FooterComponent />
  </div>
</template>

<style></style>
