<script setup>
    import { ref } from 'vue';
    import axios from "axios";

    const user = ref({
        email: "",
        password: ""
    });

    const login = async () => {
        try {
            const response = await axios.post("http://localhost:3000/user/login", user.value, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

</script>

<template>
    <main class="d-flex flex-column min-vh-100">
        <div class="popup position-relative">
            <div class="close-btn" @click="$emit('closeModal')">
                <span>
                    <svg width="20" height="20" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <line x1="5" y1="5" x2="25" y2="25" stroke="black" stroke-width="3" stroke-linecap="round"/>
                        <line x1="25" y1="5" x2="5" y2="25" stroke="black" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </span>
            </div>
            <div class="form">
                <h2>Login</h2>
                <form @submit.prevent="login">
                    <div class="form-element">
                        <label for="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter email"
                            v-model="user.email"
                        >
                    </div>
                    <div class="form-element">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            v-model="user.password"
                        >
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div class="labelled-separator">
				<span>or</span>
			</div>
            <div class="submit-container">
                <button type="submit" formaction="#" class="submit-btn">
                    <span>
                        <img src="/images/google.png" alt="Google Icon" height="30">
                    </span>
                    Continue with Google
                </button>
            </div>
        </div>
    </main>
</template>

<style scoped>
    .popup {
        width: 35vw;
        margin: auto;
        background: rgb(235, 235, 235);
        border-radius: 10px;
        padding: 4rem 1rem;
        position: relative;
        border: 1px solid black;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
    .popup .close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .popup .form {
        width: 90%;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .popup .form h2 {
        text-align: center;
        color: black;
        margin-bottom: 20px;
        font-size: 25px;
    }
    .popup .form .form-element {
        margin: 10px 0;
    }
    .popup .form .form-element label {
        font-size: 14px;
        color: black;
    }
    .popup .form .form-element input {
        margin-top: 5px;
        width: 100%;
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        outline: none;
    }
    .popup .form button {
        width: 100%;
        padding: 0.5rem 0;
        border: none;
        font-size: 16px;
        background: #FFC107;
        color: white;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.2s ease-in-out;
    }
    .popup .form button:hover {
        background-color: var(--highlight-dark-50);
    }
    .labelled-separator {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #666;
        margin: 15px 0;
    }
    .labelled-separator::before,
    .labelled-separator::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #ccc;
        margin: 0 10px;
    }
    .submit-container {
        width: 90%;
        margin: 0 auto;
    }
    .submit-btn {
        outline: none;
        border-width: 1.1px;
        padding: 0.5rem;
        border-radius: 5px;
        width: 100%;
        margin: 0 auto;
        background-color: white;
    }
</style>