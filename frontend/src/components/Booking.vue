<script setup>
    import { ref, toRefs, computed, watch } from 'vue';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import 'vue3-carousel/carousel.css'
    import he from 'he';

    const props = defineProps({
        booking: Object
    });

    const { booking } = toRefs(props);
    const venue = computed(() => booking.value.venueId);

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
    })

    const carouselConfig = {
        height: 400,
        itemsToShow: 1,
        wrapAround: true,
    }
</script>

<template>
    <div class="d-flex gap-3 mb-3 py-3">
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
            <div class="d-flex flex-column gap-1">
                <h4 class="text-truncate">{{ venue.venueName }}</h4>
                <p class="text-truncate"><b>Address: </b>{{ address }}</p>
                <p><b>Booking Start Date:</b> {{ formattedBookingStartDate }}</p>
                <p><b>Booking End Date:</b> {{ formattedBookingEndDate }}</p>
                <p><b>Attendees:</b>: {{ booking.numAttendees }}</p>
            </div>
            <div class="d-flex justify-content-end mt-2">
                <button class="border-0 red" @click="cancelBooking">Cancel Booking</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

    .red {
        color: red;
    }

    .red:hover {
        text-decoration: underline;
    }
</style>