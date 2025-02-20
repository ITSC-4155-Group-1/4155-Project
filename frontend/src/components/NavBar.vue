<script setup>
    import '../assets/main.css';
</script>

<template>
    <nav class="navbar navbar-expand-lg d-flex justify-content-between align-items-center my-3 mx-4">
        <div>
            <a class="navbar-brand" href="#">
                <img src="/images/gatherly_logo.png" alt="logo" height="70">
            </a>
        </div>
        <div>
            <div id="navbarNav">
                <ul class="navbar-nav gap-3">
                    <li class="nav-item px-2 rounded-pill custom-link">
                        <a class="nav-link" href="#">Login</a>
                    </li>
                    <li class="nav-item px-2 rounded-pill custom-link">
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
        transition: background-color 0.2s ease-in-out;
    }
    .custom-link a {
        color: var(--background);
        font-size: 16px;
    }

    .custom-link:hover {
        background-color: var(--accent-dark-50);
        text-decoration: none;
    }
</style>