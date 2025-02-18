<script setup>
    import '../assets/main.css';
</script>

<template>
    <nav class="navbar navbar-expand-lg d-flex justify-content-between m-3">
        <div class="mx-3">
            <a class="navbar-brand" href="#">
                <img src="/gatherly_logo.png" alt="logo" height="60">
            </a>
        </div>
        <div class="d-flex align-items-center">
            <div class="me-3 custom-nav-sizing" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item px-2 mx-2 text-center border border-2 rounded-pill custom-link">
                        <a class="nav-link" href="#">Login</a>
                    </li>
                    <li class="nav-item px-2 mx-2 text-center border border-2 rounded-pill custom-link">
                        <a class="nav-link" href="#">Sign Up</a>
                    </li>
                </ul>
            </div>
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
        font-size: 16px;
    }
</style>