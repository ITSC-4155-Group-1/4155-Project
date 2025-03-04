import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cartDetails = ref({});

    const setCartDetails = (details) => {
        cartDetails.value = details;
    }

    return { cartDetails, setCartDetails };
})