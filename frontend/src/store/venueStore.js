import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { showErrorToast } from '../utils/toast';

export const useVenueStore = defineStore('venue', () => {
    const allVenues = ref([]);

    const successMessage = ref(localStorage.getItem('successMessage') || null);

    const setSuccessMessage = (message) => {
        successMessage.value = message;
        localStorage.setItem('successMessage', message);
    };

    const clearSuccessMessage = () => {
        successMessage.value = null;
        localStorage.removeItem('successMessage');
    };

    const fetchAllVenues = async () => {
        try {
            const response = await axios.get('http://localhost:3000/venue');
            if (response.data.success) {
                allVenues.value = response.data.venues;
                return { success: true, venues: allVenues.value };
            }
        } catch (e) {
            showErrorToast('Error fetching venues. Please try again later.');
            console.error('Error fetching venues:', e);
        }
    };

    // Fetch specific venue
    const getVenueById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/venue/${id}`);
            if (response.data.success) {
                return [response.data.venue, response.data.host];
            }
        } catch (e) {
            showErrorToast('Error fetching venue. Please try again later.');
            console.error('Error fetching venue:', e);
        }
    };

    const getBookingsForVenueById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/booking/${id}`, {
                withCredentials: true,
            });
            if (response.data.success) {
                return response.data.bookings;
            }
        } catch (e) {
            showErrorToast('Error fetching bookings. Please try again later.');
            console.error('Error fetching bookings:', e);
        }
    };

    const getAllBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/booking/`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data.bookings;
            }
        } catch (e) {
            showErrorToast('Error fetching bookings. Please try again later.');
            console.error('Error fetching bookings:', e);
        }
    }

    const createVenue = async (data) => {
        const dates = [];
        data.availability.forEach(date=>{
            dates.push(new Date(date));
        })

        const formData = new FormData();
        
        formData.append('state', data.state);
        formData.append('city', data.city);
        formData.append('address', data.address);
        formData.append('zipCode', data.zipCode);
        formData.append('venueName', data.venueName);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('capacity', data.capacity);
        data.images.forEach(image => {
            formData.append('images', image);
        });
        dates.forEach(date => {
            formData.append('availability', date);
        });

        try {
            const response = await axios.post("http://localhost:3000/venue/", formData, {
                withCredentials: true,
                headers: {'Content-Type': 'multipart/form-data'}
            });

            if(response.data.success){
                return true;
            } else if(response.data.invalid){
                console.log(response.data.invalid)
                return false;
            }
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }

    const deleteVenue = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/venue/${id}`, {
                withCredentials: true,
            });
            if (response.data.success) {
                allVenues.value = allVenues.value.filter((venue) => venue._id !== id);
                return true;
            }
        } catch (e) {
            showErrorToast('Error deleting venue. Please try again later.');
            console.error('Error deleting venue:', e.response.data);
        }
    }

    const editVenue = async(data, id) => {
        const dates = [];
        data.availability.forEach(date=>{
            dates.push(new Date(date));
        })

        const formData = new FormData();
        
        formData.append('state', data.state);
        formData.append('city', data.city);
        formData.append('address', data.address);
        formData.append('zipCode', data.zipCode);
        formData.append('venueName', data.venueName);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('capacity', data.capacity);
        data.images.forEach(image => {
            formData.append('images', image);
        });
        dates.forEach(date => {
            formData.append('availability', date);
        });

        try {
            const response = await axios.put(`http://localhost:3000/venue/${id}`, formData, {
                withCredentials: true,
                headers: {'Content-Type': 'multipart/form-data'}
            });

            if(response.data.success){
                return true;
            } else if(response.data.invalid){
                console.log(response.data.invalid)
                return false;
            }
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }

    const favoriteAVenue = async (venueId) => {
        try {
            const response = await axios.post(`http://localhost:3000/favorites/`, { venueId }, {
                withCredentials: true,
            });

            if (response.status === 401) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 403) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 500) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 201) {
                return {status: true, message: response.data.message};
            }
        } catch (e) {
            showErrorToast('Error favoriting venue. Please try again later.');
        }
    }

    const unfavoriteAVenue = async (venueId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/favorites/`, {
                withCredentials: true,
                data: { venueId },
            });

            if (response.status === 401) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 400) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 403) {
                return { status: false, message: response.data.error };
            }

            if (response.status === 200) {
                return {status: true, message: response.data.message};
            }
        } catch (e) {
            showErrorToast('Error unfavoriting venue. Please try again later.');
        }
    }

    const isVenueFavorited = async (venueId) => {
        try {
            const response = await axios.get(`http://localhost:3000/favorites/${venueId}`, {
                withCredentials: true,
            });

            // venue is not favorited
            if (response.status === 200 && !response.data.isFavorited) {
                return false;
            }

            // venue is favorited
            if (response.status === 200 && response.data.isFavorited) {
                return true;
            }
        } catch (error) {
            showErrorToast('Error checking favorite status. Please try again later.');
        }
    }

    const getFavoritedVenues = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/favorites/`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                return response.data.favoritedVenues;
            }
        } catch (error) {
            showErrorToast('Error fetching favorited venues. Please try again later.');
        }
    }

    return {
        successMessage,
        setSuccessMessage,
        clearSuccessMessage,
        allVenues,
        fetchAllVenues,
        getVenueById,
        getBookingsForVenueById,
        getAllBookings,
        createVenue,
        deleteVenue,
        editVenue,
        favoriteAVenue,
        unfavoriteAVenue,
        isVenueFavorited,
        getFavoritedVenues,
    }
});