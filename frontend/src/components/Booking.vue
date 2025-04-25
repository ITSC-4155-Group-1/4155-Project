<script setup>
    import { ref, toRefs, computed, watch, nextTick, onMounted } from 'vue';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import 'vue3-carousel/carousel.css'
    import he from 'he';
    import axios from 'axios';
    import { showErrorToast } from '../utils/toast.js';
    import { useRouter, useRoute } from 'vue-router';
    import { parseUser } from '../utils/userUtils.js';

    const props = defineProps({
        booking: Object,
        isOld: Boolean,
    });

    const { booking, isOld } = toRefs(props);
    const venue = computed(() => booking.value.venueId);
    const cancelBookingModal = ref(false);
    const router = useRouter();
    const route = useRoute();
    const venueReviews = ref([]);
    const hasReviewed = ref(false);
    const user = parseUser();

    const getReviewsById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/review/${id}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                venueReviews.value = response.data.reviews;
            }
        } catch (error) {
            showErrorToast('Unable to retrieve reviews for this venue.')
            console.log(error);
        }
    }

    onMounted(async () => {
        const venueId = venue.value._id;
        await getReviewsById(venueId);
    })

    //AI-Contribution
    watch(() => venueReviews.value, (newReviews) => {
        newReviews.forEach(review => {
            if(review.reviewerId._id === user?.id) {
                hasReviewed.value = true;
            }
        })
    })

    const usAbbreviations = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }

    const usStateToAbbreviation = (state) => {
        for (let key in usAbbreviations) {
            if (usAbbreviations[key] === state) {
                return key;
            }
        }
        return state;
    }
    
    const address = computed(() => {
        return he.decode(`${venue.value.address}, ${venue.value.city}, ${usStateToAbbreviation(venue.value.state)} ${venue.value.zipCode}`);
    })

    const toggleCancelBookingModal = () => {
        cancelBookingModal.value = !cancelBookingModal.value;
    }

    const cancelBooking = async () => {
        const bookingId = booking.value._id;
        try {
            const response = await axios.delete(`http://localhost:3000/booking/`, {
                withCredentials: true,
                data: { bookingId },
            });

            if (response.status === 200) {
                location.reload();
                localStorage.setItem('successMessage', "Booking cancelled successfully");
            }
        } catch (error) {
            showErrorToast('Error canceling booking. Please try again later.');
        }
    }

    const rateTheVenue = (event) => {
        event.stopPropagation();
        router.push(`/review/${venue.value._id}`);
    }

    const formattedBookingStartDate = computed(() => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(booking.value.bookingStartDate));
    });

    const formattedBookingEndDate = computed(() => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(booking.value.bookingEndDate));
    });

    watch(() => venue.value.venueName, () => {
        const newTitle = he.decode(venue.value.venueName);
        venue.value.venueName = newTitle;
        console.log(venue.value.venueName)
    })

    const carouselConfig = {
        height: 400,
        itemsToShow: 1,
        wrapAround: true,
    }
</script>

<template>
    <div class="d-flex gap-3 mb-3 py-3 booking-container">
        <div class="image-container">
            <Carousel v-bind="carouselConfig">
                <Slide v-for="image in venue.images" :key="image">
                    <img :src="image" alt="Venue Images" loading="lazy">
                </Slide>

                <template #addons>
                    <Navigation class="mx-1" />
                </template>
            </Carousel>
        </div>
        <div class="d-flex flex-column justify-content-between">
            <div class="d-flex flex-column gap-1 booking-details">
                <h4>{{ venue.venueName }}</h4>
                <p><b>Address: </b>{{ address }}</p>
                <p><b>Booking Start Date:</b> {{ formattedBookingStartDate }}</p>
                <p><b>Booking End Date:</b> {{ formattedBookingEndDate }}</p>
                <p><b>Attendees:</b>: {{ booking.numAttendees }}</p>
            </div>
            <div class="d-flex justify-content-end">
                <button v-if="!isOld" class="border-0 red" @click="toggleCancelBookingModal">Cancel Booking</button>
                <button v-else-if="isOld && !hasReviewed" class="border-0 pink" @click="rateTheVenue">
                    Rate the Venue
                </button>
            </div>
        </div>
    </div>
    <div v-if="cancelBookingModal" class="overlay">
        <div class="popup bg-light">
            <button class="close-btn" @click="toggleCancelBookingModal">
                &times;
            </button>

            <div>
                <h3>Do you wish to continue?</h3>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn w-50 mt-3 custom-btn confirm" @click="cancelBooking">
                        Confirm
                    </button>
                    <button type="submit" class="btn w-50 mt-3 custom-btn cancel" @click="toggleCancelBookingModal">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .booking-container {
        width: 85vw;
    }

    .booking-details p {
        width: 45ch;
    }

    .image-container {
        width: 60%;
        height: 400px;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.5rem;
    }

    .carousel {
        --vc-nav-background: rgba(255, 255, 255, 0.7);
        --vc-nav-border-radius: 100%;
    }

    h4 {
        color: var(--primary);
    }

    .red {
        color: red;
    }

    .pink {
        color: var(--accent);
    }

    .red:hover, .pink:hover {
        text-decoration: underline;
    }

    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .popup {
        position: relative;
        width: 50%;
        background: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
    }

    .close-btn {
        position: absolute;
        top: 5px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2em;
        cursor: pointer;
        color: #333;
    }

    .custom-btn {
        width: fit-content;
        padding: 0.75rem 2rem;
        color: white;
        transition: background-color 0.2s ease-in-out;
    }

    .confirm {
        color: white;
        background-color: var(--highlight);
    }

    .confirm:hover {
        color: white;
        background-color: var(--highlight-dark-50);
    }

    .cancel {
        color: white;
        background-color: red;
    }

    .cancel:hover {
        color: white;
        background-color: darkred;
    }
</style>