<script setup>
    import '../assets/main.css';
    import { ref, watch, onBeforeUnmount, onMounted, computed } from 'vue';
    import axios from 'axios';
    import { useRoute } from 'vue-router';
    import LoginModal from './LoginModal.vue';
    import SignupModal from './SignupModal.vue';
    import router from '../router';
    import { useUserStore } from '../store/userDetails';

    const route = useRoute();
    const user = ref(null);
    const isLoggedIn = ref(false);
    const showWhichModal = ref(null);
    const isScrolled = ref(false);
    const isNavCollapsed = ref(true);
    const errorMessage = ref('');
    const successMessage = ref('');
    const showErrorBanner = ref(false);
    const showSuccessBanner = ref(false);
    const userStore = useUserStore();

    const toggleNavbar = () => {
        isNavCollapsed.value = !isNavCollapsed.value;
    };

    const closeNavbar = () => {
        isNavCollapsed.value = true;
    };

    const expandedHeight = '100vh';

    const navStyle = computed(() => ({
        height: isNavCollapsed.value ? '0' : expandedHeight,
        overflow: 'hidden',
        transition: 'height 0.3s ease-in-out'
    }));

    const showModal = (modal) => {
        showWhichModal.value = modal;
        closeNavbar();
        document.body.style.overflow = 'hidden';
    };

    const showLoginModal = () => {
        showWhichModal.value = 'login';
        closeNavbar();
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        showWhichModal.value = null;
        closeNavbar();
        document.body.style.overflow = 'auto';
    };

    const handleScroll = () => {
        if ((window.scrollY > 640 && route.path === '/') || (window.scrollY > 0 && route.path !== '/')) {
            isScrolled.value = true;
        } else {
            isScrolled.value = false;
        }
    };

    watch(showWhichModal, (newVal) => {
        document.body.style.overflow = newVal ? 'hidden' : 'auto';
    });

    watch(route, () => {
        closeNavbar();
    });

    onBeforeUnmount(() => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('scroll', handleScroll);
    });

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll();

        const savedToken = localStorage.getItem("authToken");
        if (savedToken) {
            toggleLoggedIn(JSON.parse(savedToken));
        }
    });

    const displayErrorBanner = (message) => {
        errorMessage.value = message;
        showErrorBanner.value = true;
        setTimeout(() => {
            showErrorBanner.value = false;
        }, 2000);
    };

    const displaySuccessBanner = (message) => {
        successMessage.value = message;
        showSuccessBanner.value = true;
        setTimeout(() => {
            showSuccessBanner.value = false;
        }, 1000);
    };

    const toggleLoggedIn = (token) => {
        if (token) {
            isLoggedIn.value = !isLoggedIn.value;
            user.value = token.value;
            localStorage.setItem("authToken", JSON.stringify(token));
        } else {
            isLoggedIn.value = false;
            user.value = null;
            localStorage.removeItem("authToken");
        }
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:3000/user/logout', { withCredentials: true });
            userStore.clearUser();
            toggleLoggedIn(null);
            displaySuccessBanner("Successfully logged out");
            closeNavbar();
            router.push('/')
        } catch (error) {
            displayErrorBanner(error.response?.data?.message || "Logout failed");
        }
    };
</script>

<template>
    <nav class="navbar navbar-expand-lg fixed-top px-3 py-2" :class="{ 'scrolled': isScrolled }">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">
                <img src="/images/gatherly_logo.png" alt="logo" height="60">
            </RouterLink>

            <button
                class="navbar-toggler"
                type="button"
                @click="toggleNavbar"
            >
                <span
                    class="navbar-toggler-icon"
                    :class="{
                        'white': !isScrolled && route.path === '/',
                        'black': isScrolled || route.path !== '/'
                    }"
                ></span>
            </button>

            <div 
                class="navbar-collapse"
                :class="{ 'show': !isNavCollapsed }"
                :style="navStyle"
            >
                <button class="close-btn" @click="toggleNavbar">×</button>
                <ul class="navbar-nav">
                    <li v-if="!isLoggedIn">
                        <a class="nav-link" @click="showModal('login')">Login</a>
                    </li>
                    <li v-if="!isLoggedIn">
                        <a class="nav-link" @click="showModal('signup')">Sign Up</a>
                    </li>
                    <RouterLink 
                        v-if="isLoggedIn"
                        to="/venues/new"
                        class="nav-link"
                    >
                        Provide a Space
                    </RouterLink>
                    <RouterLink 
                        v-if="isLoggedIn"
                        to="/cart"
                        class="nav-link"
                    >
                        Your Cart
                    </RouterLink>
                    <RouterLink 
                        v-if="isLoggedIn"
                        to="/settings"
                        class="nav-link"
                    >
                        Settings
                    </RouterLink>
                    <li v-if="isLoggedIn">
                        <a class="nav-link" @click="logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <transition name="fade">
        <div v-if="showSuccessBanner" class="success-banner">
            {{ successMessage }}
        </div>
    </transition>

    <transition name="fade">
        <div v-if="showErrorBanner" class="error-banner">
            {{ errorMessage }}
        </div>
    </transition>

    <div
        class="position-fixed top-50 start-50 translate-middle z-1 background-modal-overlay"
        v-if = "showWhichModal"
    >
        <LoginModal
            v-if = "showWhichModal === 'login'"
            @closeModal= "closeModal"
            @setError="displayErrorBanner"
            @setSuccess="displaySuccessBanner"
            @setLoggedIn="toggleLoggedIn"
        />
        <SignupModal
            v-if = "showWhichModal === 'signup'"
            @closeModal= "closeModal"
            @switchToLogin= "showLoginModal"
            @setError="displayErrorBanner"
            @setSuccess="displaySuccessBanner"
        />
    </div>
</template>

<style scoped>
    nav {
        min-height: 86px;
        transition: background-color 0.2s ease-in-out;
    }

    .success-banner, .error-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.25rem;
        text-align: center;
        z-index: 9999;
        font-weight: bold;
        opacity: 1;
        transition: opacity 0.5s ease-in-out; /* Smooth fade effect */
    }

    .success-banner {
        background-color: #4CAF50;
        color: white;
    }

    .error-banner {
        background-color: #f44336;
        color: white;
        width: 100vw;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s ease-in-out;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .scrolled {
        background-color: var(--background);
    }

    .navbar-toggler {
        border: none;
        background: transparent;
    }

    .navbar-toggler:focus {
        outline: none;
        box-shadow: none;
    }

    .navbar-toggler-icon {
        content: "";
        display: block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        transition: background-image 0.2s ease-in-out;
    }

    .navbar-toggler-icon.white {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='white' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
    }

    .navbar-toggler-icon.black {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='black' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
    }

    .navbar-collapse {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--background);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        transition: height 0.3s ease-in-out;
    }

    .navbar-nav {
        list-style: none;
        padding: 0;
        text-align: center;
    }

    .nav-item {
        margin: 10px 0;
    }

    .nav-link {
        font-size: 1.3rem;
        color: var(--accent);
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease-in-out;
        margin: 1rem 0;
    }

    .navbar .navbar-nav .nav-link:hover,
    .navbar a.nav-link:hover {
        color: var(--accent-dark-50) !important;
        cursor: pointer;
    }

    .nav-link:active,
    .nav-link:focus {
        color: var(--accent) !important;
    }

    .nav-link:visited {
        color: var(--accent) !important;
    }

    .close-btn {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 2rem;
        background: none;
        border: none;
        color: black;
        cursor: pointer;
    }

    @media screen and (min-width: 1000px) {
        .navbar-collapse {
            position: static;
            height: auto !important;
            background: transparent;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            transition: none;
        }
        
        .navbar-nav {
            display: flex;
            gap: 20px;
        }
        
        .close-btn {
            display: none;
        }
    }
</style>

