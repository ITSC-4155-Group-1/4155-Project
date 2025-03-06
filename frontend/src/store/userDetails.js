import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('user', () => {
    const userDetails = ref({
        email: '',
        passwordLength: 0,
        token: '',
    });

    const setUserDetails = (user) => {
        userDetails.value = user;
    }

    return { userDetails, setUserDetails };
})