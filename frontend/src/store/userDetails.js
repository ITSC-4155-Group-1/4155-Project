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
        user.value.email = userData.email;
        user.value.token = userData.token;
        localStorage.setItem('user', JSON.stringify(user.value));
    }

    const clearUser = () => {
        user.value = { email: '', token: '' }
        localStorage.removeItem('user');
        cookies.removeCookie('authToken');
    }

    const login = async (credentials) => {
        const creds = {
            email: credentials.email,
            password: credentials.password,
        };

        try {
            const response = await axios.post('http://localhost:3000/user/login', creds, {
                withCredentials: true,
            });

            if (response.data.success) {
                setUser({
                    email: credentials.email,
                    token: response.data.token,
                });

                return { success: true, token: response.data.token, message: response.data.success };
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.invalid) {
                return { success: false, error: error.response.data.invalid }
            }
            console.error('error', error)
            return { success: false, error: 'An unexpected error occurred. Please try again.' }
        }
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

    return { user, setUser, clearUser, login, logout }
})