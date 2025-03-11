export const parseUser = () => {
    const userData = localStorage.getItem('user')

    if (!userData) return null; // null if the no user exists

    try {
        const parsedUser = JSON.parse(userData)

        const user = parsedUser._value || parsedUser;

        return {
            email: user?.email || 'example@gmail.com',
            firstName: user?.token?.firstName || 'Guest',
            lastName: user?.token?.lastName || 'User',
        }
    } catch (e) {
        console.error("Error parsing user data", e)
        return null;
    }
}


