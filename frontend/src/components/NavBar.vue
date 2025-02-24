<script setup>
    import '../assets/main.css';
    import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import LoginModal from './LoginModal.vue';
    import SignupModal from './SignupModal.vue';

    const route = useRoute();
    const isLoggedIn = true; // will be set to true when the user is logged in
    const showWhichModal = ref(null);
    const isScrolled = ref(false);

    const showModal = (modal) => {
        showWhichModal.value = modal;
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        showWhichModal.value = null;
        document.body.style.overflow = 'auto'; 
    }

    watch(showWhichModal, (newVal) => {
        if (newVal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    const handleScroll = () => {
        if (window.scrollY > 640) {
            isScrolled.value = true;
        } else {
            isScrolled.value = false;
        }
    }

    onMounted(() => {
        if (route.path === '/') {
            window.addEventListener('scroll', handleScroll);
        }
    });

    onBeforeUnmount(() => {
        document.body.style.overflow = 'auto'; 
        window.removeEventListener('scroll', handleScroll);
    });

</script>

<template>
    <nav class="navbar navbar-expand-lg fixed-top px-3 py-1" :class="{ 'scrolled': isScrolled && route.path === '/' }">
        <div class="container-fluid d-flex align-items-center">
            <RouterLink class="navbar-brand" to="/">
                <img src="/images/gatherly_logo.png" alt="logo" height="70">
            </RouterLink>
            <div id="navbarNav">
                <ul class="navbar-nav gap-3">
                    <li v-if="!isLoggedIn" class="px-2 rounded-pill custom-link">
                        <a class="nav-link" @click="showModal('login')">Login</a>
                    </li>
                    <li v-if="!isLoggedIn" class="px-2 rounded-pill custom-link">
                        <a class="nav-link" @click="showModal('signup')">Sign Up</a>
                    </li>
                    <RouterLink v-if="isLoggedIn" class="px-2 rounded-pill custom-link nav-link" to="/settings">
                        Settings
                    </RouterLink>
                </ul>
            </div>
        </div>
</nav>


    <div class="position-fixed top-50 start-50 translate-middle z-1 background-modal-overlay" v-if="showWhichModal">
        <LoginModal v-if="showWhichModal === 'login'" @closeModal="closeModal()" />
        <SignupModal v-if="showWhichModal === 'signup'" @closeModal="closeModal()" />
    </div>
</template>

<style scoped>
    .scrolled {
        background-color: rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s ease-in-out;
    }

    .custom-link {
        border: 2px solid var(--background);
        background-color: var(--accent);
        transition: background-color 0.2s ease-in-out;
    }
    .custom-link a {
        color: var(--background);
        font-size: 16px;
    }

    .nav-link {
        color: var(--background);
    }

    .custom-link:hover {
        background-color: var(--accent-dark-50);
        text-decoration: none;
        cursor: pointer;
    }

    .background-modal-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
    }
</style>