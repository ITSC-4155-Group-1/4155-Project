<script setup>
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { venues } from "../../../mockdata";

    const router = useRouter();
    const route = useRoute();
    const mockVenue = venues[0];

    const goBack = () => {
        router.back();
    }

    const host = route.query.host;
    const venueName = route.query.venueName;
    const venuePrice = route.query.venuePrice;
    const startDate = route.query.startDate;
    const endDate = route.query.endDate;
    const attendees = route.query.attendees;
    const cleaningFee = route.query.cleaningFee;
    const taxes = route.query.processing;;
    const images = route.query.image ? route.query.image.split(',') : [];
    const total = ref(0);

    
    const abbreviatedDates = computed(() => {
        const months = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        };
        const start = [months[new Date(startDate).getMonth()], new Date(startDate).getDate()];
        const end = [months[new Date(endDate).getMonth()], new Date(endDate).getDate()];

        return `${start[0]}. ${start[1]} - ${end[0]}. ${end[1]}`;
    })

    const calculateDays = computed(() => {
        if (startDate && endDate) {
            const start = new Date(startDate).getDate();
            const end = new Date(endDate).getDate();
            const diffTime = end - start;
            return Math.max(1, diffTime);
        }
        return 0;
    });

    const totalPrice = computed(() => {
        if (!venuePrice || calculateDays.value === 0) {
            return 0;
        }

        total.value = (venuePrice * calculateDays.value) + Number(cleaningFee) + Number(taxes);
        return parseFloat(total.value).toFixed(2);
    });

    const book = () => {
        // send a request to the backend to book the venue
        console.log("Booking venue...");
    }
</script>

<template>
    <div class="shopping-cart-width mx-auto position-relative">
        <button
            @click="goBack"
            class="d-flex gap-3 align-items-center fs-2 fw-medium mb-3 underline"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30" height="30"
                viewBox="0 0 22 22"
                fill="none"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M15 18l-6-6 6-6"/>
            </svg>
            {{ venueName }}
        </button>
        <div class="d-flex gap-5 justify-content-between mb-3">
            <div class="d-flex flex-column w-75 gap-4">
                <div class="img-container">
                    <img :src="images[0]" alt="venue image">
                </div>
                <div class="d-flex flex-column">
                    <figure class="mb-0">
                        <blockquote class="blockquote mb-4">
                            <p>
                                Thank you for choosing my venue to host your event. If anything needs my immediate attention, shoot me a message and I will respond as soon as I can. Once again, it is my pleasure to host your event!
                            </p>
                        </blockquote>
                        <figcaption class="blockquote-footer d-flex align-items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="gray"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="ms-2 me-1"
                            > <!-- svg will change to the person's pfp -->
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="8" r="3" />
                                <path d="M8 18v-2a4 4 0 0 1 8 0v2" />
                            </svg>
                            {{ host ? host : "Host" }}
                        </figcaption>
                    </figure>
                    <hr class="short-border">
                </div>
                <div class="d-flex flex-column info">
                    <h3>Ground Rules</h3>
                    <p>As per the Terms of Service, we ask that you uphold standard and respectful behavior. Additionally, here are rules that we ask for you to uphold as well:</p>
                    <ol>
                        <li>
                            Respect the schedule. Please do not overstay or I may need to notify authorities
                        </li>
                        <li>
                            Be considerate of the space. Restrict your event to the space listed on Gatherly
                        </li>
                        <li>Last but not least, enjoy!</li>
                    </ol>
                    <hr class="short-border">
                </div>
                <div class="d-flex flex-column">
                    <p>
                        By selecting the button below, I agree to the Host's Venue Rules and Ground rules for attendees, and that Gatherly can charge my payment method if I'm responsible for damage. I agree to pay the total amount shown if the Host accepts my booking request
                    </p>
                    <button type="submit" class="btn" @click="book">Book</button>
                </div>
            </div>
            <div class="d-flex flex-column border border-1 border-black rounded-3 p-4 w-25 your-trip">
                <div class="info border-bottom border-black pb-4">
                    <h3>Your Trip</h3>
                    <div class="d-flex justify-content-between details">
                        <span>
                            <span class="fw-medium">Dates:</span>
                            {{ abbreviatedDates }}
                        </span>
                        <a class="color-black" href="#">Edit</a>
                    </div>
                    <div class="d-flex justify-content-between details">
                        <span>
                            <span class="fw-medium">Attendees:</span> 
                            {{ attendees }}
                        </span>
                        <a class="color-black" href="#">Edit</a>
                    </div>
                </div>
                <div class="info border-bottom border-black pb-4 pt-4">
                    <h3>Price Details</h3>
                    <div class="d-flex justify-content-between details">
                        <span>${{ venuePrice }} x {{ calculateDays }} days</span>
                        <span>${{ parseFloat(venuePrice * calculateDays).toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between details">
                        <span>Cleaning Fee</span>
                        <span>${{ parseFloat(cleaningFee).toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between details">
                        <span>Taxes</span>
                        <span>${{ parseFloat(taxes).toFixed(2) }}</span>
                    </div>
                </div>
                <div class="info pt-4">
                    <div class="d-flex justify-content-between">
                        <span class="primary-color fw-medium">Total</span>
                        <span class="primary-color fw-medium">${{ totalPrice }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .shopping-cart-width {
        width: 90%;
    }

    .underline {
        border: 0;
        border-bottom: 2px solid transparent;
    }

    .underline:hover {
        border-bottom: 2px solid black;
        cursor: pointer;
    }

    .img-container {
        height: 600px;
        overflow: hidden;
        border-radius: 17px;
    }

    .img-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .blockquote p {
        font-size: 1rem;
    }

    .short-border {
        border-bottom: 1px solid black;
        width: 90%;
        margin: 0.5rem auto;
    }

    button[type="submit"] {
        width: fit-content;
        padding: 0.75rem 2rem;
        background-color: var(--highlight);
        color: white;
        transition: background-color 0.2s ease-in-out;
    }
    
    button[type="submit"]:hover {
        background-color: var(--highlight-dark-50);
    }

    .your-trip {
        position: sticky;
        top: 96px;
        height: fit-content;
        max-height: 80vh;
        overflow-y: auto;
    }

    .info h3 {
        font-weight: medium;
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .details {
        margin-top: 1rem;
    }

    .color-black {
        color: black;
    }

    .primary-color {
        color: var(--primary);
    }
</style>