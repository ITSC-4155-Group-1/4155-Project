<script setup>
    import { ref, computed } from 'vue';
    import { useUserStore } from "../store/userDetails";

    const emit = defineEmits(["closeModal", "switchToLogin"]);
    const userStore = useUserStore();

    const rePassword = ref("");
    const passwordError = ref("");

    const newUser = ref({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const passwordsMatch = computed(() => newUser.value.password === rePassword.value || rePassword.value === "");

    const validatePasswords = () => {
        if (!passwordsMatch.value) {
            passwordError.value = "Passwords do not match.";
            return false;
        }
        passwordError.value = "";
        return true;
    };

    const signup = async () => {
        if (!validatePasswords()) return;

        const response = await userStore.signup(newUser.value);
        if (response.success) {
            setTimeout(() => {
                emit("closeModal");
                emit("switchToLogin")
            });
        }

        try {
            const response = await axios.post("http://localhost:3000/user/signup", newUser.value, {
                withCredentials: true,
            });

            if (response.data.success) {
                emit('setSuccess', response.data.success);
                setTimeout(() => {
                    emit("closeModal");
                    emit("switchToLogin")
                }, 1);
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
                                minlength="1"
                                required
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
                                minlength="1"
                                required
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
                            required
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
                            required
                            minlength="8"
                            maxlength="30"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}"
                            title="Must contain at least 8 characters, including uppercase and lowercase letters, and a number."
                        >
                        <div class="form-text">
                            Must contain at least 8 characters, including uppercase and lowercase letters, and numbers.
                        </div>
                    </div>
                    <div class="form-element">
                        <label for="password">Re-type Password</label>
                        <input
                            type="password"
                            id="re-password"
                            name="re-password"
                            placeholder="Re-type password"
                            required
                            minlength="8"
                            maxlength="30"
                            v-model="rePassword"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}"
                            title="Must contain at least 8 characters, including uppercase and lowercase letters, and a number."
                            @input="validatePasswords"
                        >
                        <p v-if="passwordError" class="text-danger mt-1">{{ passwordError }}</p>
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
        padding: 2.5rem 1rem;
        position: relative;
        border: 1px solid black;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        z-index: 1000;
        width: 75%;
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