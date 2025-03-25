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
    <div class="error-page">
        <div class="content">
            <h2> 404 Error </h2> 
            <p>Oops! The page you are looking for does not exist.</p> 
            <!-- TODO: -->
            <!-- Dino Game Here. I am going to smash my damn desk ;-; -->
            <button @click="goHome" class="home-button">Go Back Home</button>
        </div>
    </div>
</template>

<style scoped>
    .error-page {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
    }

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

    .home-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
    }

    .home-button:hover {
        background-color: #0056b3;
    }
</style>