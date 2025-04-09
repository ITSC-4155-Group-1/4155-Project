<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { parseUser } from "../utils/userUtils"
    
    const showModal = ref(false);
    const user = parseUser();
    const router = useRouter();

    const goHome = () => {
        router.push('/');
    };
</script>

<template>
    <div class="error-page d-flex justify-content-center align-items-center text-center flex-column">
        <div class="content">
            <h2> 404 Error </h2> 
            <p>Oops! The page you are looking for does not exist.</p> 
            <!-- TODO: -->
            <!-- Dino Game Here. I am going to smash my damn desk ;-; -->
            <button
                type="submit"
                class="btn custom-btn confirm mb-2"
                @click="goHome"
            >
                Go Back Home
            </button>
        </div>
    </div>
</template>

<style scoped>
    .content {
        max-width: 600px;
        padding: 20px;
    }

    .error-image {
        width: 250px;
        margin-bottom: 20px;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.2rem;
        color: #666;
    }

    .custom-btn {
        width: fit-content;
        padding: 0.75rem 2rem;
        color: white;
        transition: background-color 0.2s ease-in-out;
    }

    .confirm {
        color: white;
        background-color: var(--highlight);
    }

    .confirm:hover {
        color: white;
        background-color: var(--highlight-dark-50);
    }
</style>
