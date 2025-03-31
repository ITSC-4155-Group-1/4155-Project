import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { showErrorToast } from '@/utils/toast';

export const useVenueStore = defineStore('venue', () => {
    const allVenues = ref([]);

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
                return response.data.venue;
            }
        } catch (e) {
            showErrorToast('Error fetching venue. Please try again later.');
            console.error('Error fetching venue:', e);
        }
    };

    return { allVenues, fetchAllVenues, getVenueById };
});