import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from 'vue-cookie-next'
import axios from 'axios'
import { useRouter } from 'vue-router'


export const useUserStore = defineStore('user', () => {
    const user = ref({
        email: '',
        token: null,
    });
    
    const router = useRouter();
    const cookies = useCookie();

    const setUser = (userData) => {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(user));
    }

    const clearUser = () => {
        user.value = { email: '', token: '' }
        localStorage.removeItem('user');
        cookies.removeCookie('authToken');
    }

    const logout = async () => {
        try {
            if (cookies.getCookie('authToken')) {
                await axios.get('http://localhost:3000/user/logout', { withCredentials: true });
            }
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || error);
        }

        clearUser();
        router.push('/');
        location.reload();
    }

    return { user, setUser, clearUser, logout }
})