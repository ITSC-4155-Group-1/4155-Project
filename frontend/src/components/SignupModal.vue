<script setup>
    import { ref } from 'vue';
    import axios from "axios";

    const emit = defineEmits(["closeModal", "switchToLogin"]);

    const newUser = ref({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const signup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/user/signup", newUser.value, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                emit('setSuccess', response.data.success);
                setTimeout(() => {
                    emit("closeModal");
                    emit("switchToLogin")
                }, 2500);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400 && error.response.data.invalid) {
                    emit('setError', error.response.data.invalid)
                }
            } else {
                emit('setError', "An unexpected error occurred. Please try again.");
            }
        }
    }
</script>

<template>
    <main>
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
                <form @submit.prevent="signup" method="POST">
                    <h2>Signup</h2>
                    <div class="form-row">
                        <div class="form-element">
                            <label for="firstName">First name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                v-model="newUser.firstName"
                            >
                        </div>
                        <div class="form-element">
                            <label for="lastName">Last name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                v-model="newUser.lastName"
                            >
                        </div>
                    </div>
                    <div class="form-element">
                        <label for="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            v-model="newUser.email"
                        >
                    </div>
                    <div class="form-element">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            v-model="newUser.password"
                        >
                    </div>
                    <div class="form-element">
                        <label for="password">Re-type Password</label>
                        <input
                            type="password"
                            id="re-password"
                            name="re-password"
                            placeholder="Re-type password"
                        >
                    </div>
                    <button type="submit">Sign up</button>
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
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: auto;
        background: rgb(235, 235, 235);
        border-radius: 10px;
        padding: 4rem 1rem;
        position: relative;
        border: 1px solid black;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        z-index: 1000; /* Ensure it stays below the banner */
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
        background: transparent;
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
        margin: 10px 0 20px;
        font-size: 25px;
    }
    .popup .form .form-element {
        margin: 7px 0;
    }
    .popup .form .form-element label {
        font-size: 14px;
        color: black;
    }
    .popup .form .form-element input[type="text"],
    .popup .form .form-element input[type="password"] {
        margin-top: 5px;
        display: block;
        width: 100%;
        padding: 5px;
        outline: none;
        border: 1px solid black;
        border-radius: 5px;
    }
    .popup .form button {
        width: 100%;
        padding: 0.5rem 0;
        border: none;
        outline: none;
        font-size: 16px;
        background-color: var(--highlight);
        color: white;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.2s ease-in-out;
    }
    .popup .form button:hover {
        background-color: var(--highlight-dark-50);
    }
    .popup .form .form-element a {
        display: block;
        text-align: right;
        font-size: 15px;
        color: black;
    }
    .form-row {
        display: flex;
        gap: 10px;
    }
    .form-row .form-element {
        flex: 1;
        min-width: 0;
    }
    .labelled-separator {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 14px;
        color: #666;
        margin: 10px 0;
    }
    .labelled-separator::before,
    .labelled-separator::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #ccc;
        margin: 0 10px;
    }
    .external-login {
        width: 90%;
        margin: auto;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .submit-container {
        width: 90%;
        margin: 0 auto;
    }
    .submit-btn {
        width: 100%;
        padding: 0.5rem;
        margin: 0 auto;
        border: 1.1px solid;
        outline: none;
        border-radius: 5px;
        background-color: white;
    }
</style>