import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref({
        email: '',
        token: null,
    });

    const setUser = (userData) => {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(user));
    }

    const clearUser = () => {
        user.value = { email: '', token: '' }
        localStorage.removeItem('user');
    }

    return { user, setUser, clearUser }
})