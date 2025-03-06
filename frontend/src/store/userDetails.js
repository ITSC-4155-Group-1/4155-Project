import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('user', () => {
    const userDetails = ref({
        email: '',
        token: '',
    });

    const setUserDetails = (user) => {
        userDetails.value = user;
    }

    return { userDetails, setUserDetails };
})