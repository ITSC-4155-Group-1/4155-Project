<script setup>
    import NavBar from "./components/NavBar.vue";
    import FooterComponent from "./components/FooterComponent.vue";
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { showSuccessToast, showErrorToast } from './utils/toast';

    const router = useRouter();

    const navHeight = ref(86);

    onMounted(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navHeight.value = navbar.offsetHeight;
        }

      const storedToast = localStorage.getItem('showToast');
        if (storedToast) {
            const { message, type } = JSON.parse(storedToast);
            if (type === 'success') {
                showSuccessToast(message);
            } else {
                showErrorToast(message);
            }
            localStorage.removeItem('showToast');
        }
    });
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBar />
      <RouterView :style="{ marginTop: navHeight + 'px' }"/>
    <FooterComponent />
  </div>
</template>

<style>
</style>
