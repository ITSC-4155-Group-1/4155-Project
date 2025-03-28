import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from 'vue-cookie-next'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { showSuccessToast, showErrorToast } from '../utils/toast'


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

                showSuccessToast(response.data.success);

                return { success: true, token: response.data.token, message: response.data.success };
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.invalid) {
                showErrorToast(error.response.data.invalid);
                return { success: false, error: error.response.data.invalid }
            }
            console.error('error', error)
            showErrorToast(error.response.data.invalid);
            return { success: false, error: 'An unexpected error occurred. Please try again.' }
        }
    }

    const logout = async () => {
        try {
            if (cookies.getCookie('authToken')) {
                await axios.get('http://localhost:3000/user/logout', { withCredentials: true });
            }
        } catch (error) {
            showErrorToast(error.response.data.invalid)
            console.error('Logout failed:', error.response?.data?.message || error);
        }

        clearUser();

        localStorage.setItem('showToast', JSON.stringify(
            {
                message: 'Logged out successfully',
                type: 'success'
            }
        ));

        await router.push('/');
        location.reload();
    }

    const signup = async (newUser) => {
        const creds = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
        }
        
        try {
            const response = await axios.post('http://localhost:3000/user/signup', creds, {
                withCredentials: true,
            })

            if (response.data.success) {
                showSuccessToast(response.data.success)
                return { success: true }
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.invalid) {
                showErrorToast(error.response.data.invalid)
                return { success: false }
            }
                showErrorToast('An unexpected error occurred. Please try again.')
                return { success: false }
        }
    }

    const deleteUser = async () => {
        try {
            const response = await axios.delete(
                'http://localhost:3000/user', 
                { withCredentials: true }
            )

            if (response.data.success) {
                localStorage.setItem('showToast', JSON.stringify(
                    {
                        message: response.data.success,
                        type: 'success'
                    }
                ));

                clearUser()
                await router.push('/')
                location.reload()
            }
        } catch (error) {
            showErrorToast('An unexpected error occurred. Please try again.')
            console.error('Failed to delete user:', error.response?.data?.message || error)
        }

    }

    return { user, setUser, clearUser, login, logout, signup, deleteUser }
})