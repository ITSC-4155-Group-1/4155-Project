<script setup>
    import { ref, onMounted } from 'vue';

    const navHeight = ref(0);

    onMounted(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navHeight.value = navbar.offsetHeight;
        }
    });
</script>

<template>
    <div :style="{ marginTop: navHeight + 'px' }">
        <h1>Settings Page</h1>
    </div>
</template>

<style scoped>
    div {
        height: 200vh;
    }
</style>