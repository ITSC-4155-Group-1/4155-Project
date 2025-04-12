<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import { venues } from '../../../mockdata';
    import { useRouter, useRoute } from 'vue-router';
    import { showSuccessToast, showErrorToast } from '../utils/toast';
    import axios from 'axios';
    import he from 'he';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import 'vue3-carousel/carousel.css'

    const booking = ref(null);
    const venue = ref({});
    const review = ref({
        description: '',
        rating: 0,
    });
    const router = useRouter();
    const route = useRoute();
    const hoverRating = ref(0);
    const hostFirstName = ref('');
    const images = ref([])
    const address = ref('');
    const formattedBookingStartDate = ref('');
    const formattedBookingEndDate = ref('');

    const getBooking = async () => {
        const venueId = route.params.id;
        try {
            const response = await axios.get(`http://localhost:3000/booking/review/${venueId}`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                booking.value = response.data.booking;
                venue.value = response.data.booking.venueId;
            }
        } catch (error) {
            showErrorToast('Error fetching booking data. Please try again later.');
        }
    };

    onMounted(async () => {
        await getBooking();
    });

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

    watch(() => booking.value, () => {
        if (booking.value) {
            hostFirstName.value = venue.value.host.firstName;
            images.value = venue.value.images;
            address.value = he.decode(`${venue.value.address}, ${venue.value.city}, ${usStateToAbbreviation(venue.value.state)} ${venue.value.zipCode}`);
            formattedBookingStartDate.value = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(new Date(booking.value.bookingStartDate));
            formattedBookingEndDate.value = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(new Date(booking.value.bookingEndDate));
        }
    });

    const setRating = (star) => {
        review.value.rating = star;
    };

    const setHover = (star) => {
        hoverRating.value = star;
    };

    // TODO: David, your code is gonna go in here, everything else is set up already
    const submitReview = async () => {
        try {
            await router.push('/');

            console.log(review.value)

            showSuccessToast('Review submitted successfully.');
        } catch (err) {
            showErrorToast('Failed to submit review. Please try again.');
        }
    };
    const carouselConfig = {
        height: 350,
        itemsToShow: 1,
        wrapAround: true,
    }
</script>

<template>
    <div class="w-75 mx-auto d-flex flex-column gap-3">
        <h1>Write a Review</h1>
        <div class="d-flex justify-content-center gap-4">
            <div class="w-50 image-container">
                <!-- <img loading="lazy" :src="images[0]" alt="main image of venue" class="image-height w-100 object-fit-cover object-position-center rounded" /> -->
                <Carousel v-bind="carouselConfig">
                    <Slide v-for="image in images" :key="image">
                        <img :src="image" alt="Venue Images" loading="lazy">
                    </Slide>

                    <template #addons>
                        <Navigation class="mx-1" />
                    </template>
                </Carousel>
            </div>
            <div class="w-75">
                <h2>
                    {{ venue.venueName }}
                    <span class="fs-5">(Hosted by {{ hostFirstName }})</span>
                </h2>
                <p><b>Address: </b>{{ address }}</p>
                <p v-if="hostFirstName"><b>Hosted by: </b>{{ hostFirstName }}</p>
                <p>
                    <span><b>Booking Start Date: </b></span>
                    {{ formattedBookingStartDate }}
                </p>
                <p>
                    <span><b>Booking End Date: </b></span>
                    {{ formattedBookingEndDate }}
                </p>
            </div>
        </div>

        <div class="w-75 d-flex flex-column gap-2">
            <div class="d-flex gap-1 mb-1 align-items-center">
                <p class="fs-5 p-0 my-0 me-2">Rating:</p>
                <div>
                    <span v-for="star in 5" :key="star" role="button" class="me-1" @click="setRating(star)" @mouseover="setHover(star)" @mouseleave="setHover(0)">
                        <svg width="35" height="35" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5" :fill="star <= hoverRating || star <= review.rating ? '#FFC107' : 'none'" stroke="#FFC107" stroke-width="1" />
                        </svg>
                    </span>
                </div>
            </div>

            <div>
                <p class="fs-5 p-0 my-0 me-2">Description:</p>
                <textarea v-model="review.description" placeholder="Write a review..." class="p-2 w-100" rows="10"></textarea>
            </div>

            <div class="d-flex gap-2">
                <button type="submit" class="btn custom-btn confirm mb-2" @click="submitReview">
                    Review
                </button>
                <button type="button" class="btn custom-btn cancel mb-2" @click="$router.push('/')">
                    No Thanks
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .image-container {
        width: 60%;
        height: 350px;
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

    h2 {
        color: var(--primary);
    }

    span {
        transition: color 0.3s ease;
    }

    textarea {
        outline: none;
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
