<script setup>
    import NavBar from "./components/NavBar.vue";
    import FooterComponent from "./components/FooterComponent.vue";
    import { ref, onMounted } from 'vue';
    import { showSuccessToast, showErrorToast } from './utils/toast';
    import { useUserStore } from './store/userStore';

    const navHeight = ref(86);
    const userStore = useUserStore();

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

        const successMessage = localStorage.getItem('loginSuccessMessage');
        if (successMessage) {
            showSuccessToast(successMessage);
            setTimeout(() => {
              userStore.clearSuccessMessage();
            }, 5000)
        }

        const routeErrorMessage = localStorage.getItem('routeError');
        if (routeErrorMessage) {
          showErrorToast(routeErrorMessage);
          setTimeout(() => {
            localStorage.removeItem('routeError');
          }, 5000);
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
