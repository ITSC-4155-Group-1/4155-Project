<script setup>
    import '../assets/main.css';
</script>

<template>
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand mx-4" href="#">
            <img src="/gatherly_logo.png" alt="logo" height="75">
        </a>

        <button class="navbar-toggler mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end mx-2" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item fs-5 px-2 border rounded-pill custom-link">
                    <a class="nav-link " href="#">Login</a>
                </li>
                <li class="nav-item fs-5 px-2 mx-2 border rounded-pill custom-link">
                    <a class="nav-link" href="#">Sign Up</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
    .custom-link {
        border: 2px solid var(--background);
        background-color: var(--accent);
    }
    .custom-link a {
        color: var(--background);
    }
</style>