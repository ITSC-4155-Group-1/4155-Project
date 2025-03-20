<script setup>
    import { ref, computed, watch, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useCartStore } from '../store/cartStore'

    const router = useRouter();
    const cartStore = useCartStore();

    const goBack = () => {
        router.back();
    }

    const host = cartStore.cartDetails.host;
    const venueName = cartStore.cartDetails.venueName;
    const venuePrice = cartStore.cartDetails.venuePrice;
    const reserveDates = ref([cartStore.cartDetails.startDate, cartStore.cartDetails.endDate]);
    const newReserveDates = ref(null);
    const attendees = ref(cartStore.cartDetails.attendees);
    const newAttendees = ref('');
    const cleaningFee = cartStore.cartDetails.cleaningFee;
    const taxes = cartStore.cartDetails.processing;;
    const images = cartStore.cartDetails.image ? cartStore.cartDetails.image.split(',') : [];
    const total = ref(0);
    const dateModalToggled = ref(false);
    const newDatesError = ref("");
    const attendeesModalToggled = ref(false);
    const newAttendeesError = ref("");

    
    const abbreviatedDates = computed(() => {
        const months = {
            0: "Jan",
            1: "Feb",
            2: "Mar",
            3: "Apr",
            4: "May",
            5: "Jun",
            6: "Jul",
            7: "Aug",
            8: "Sep",
            9: "Oct",
            10: "Nov",
            11: "Dec"
        };
        const start = [
            months[new Date(reserveDates.value[0]).getMonth()], 
            new Date(reserveDates.value[0]).getDate()
        ];
        const end = [
            months[new Date(reserveDates.value[1]).getMonth()],
            new Date(reserveDates.value[1]).getDate()
        ];

        return `${start[0]}. ${start[1]} - ${end[0]}. ${end[1]}`;
    })

    const calculateDays = computed(() => {
        if (reserveDates.value[0] && reserveDates.value[1]) {
            const start = new Date(reserveDates.value[0]).getDate();
            const end = new Date(reserveDates.value[1]).getDate();
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

    const validAttendeeOptions = computed(() => {
        const capacity = cartStore.cartDetails.capacity;
        const options = [
            { label: '1-40', value: '1-40' },
            { label: '41-100', value: '41-100' },
            { label: '101-200', value: '101-200' },
            { label: '200+', value: '200+' }
        ];

        const validOptions = [];

        options.forEach(option => {
            const [min, max] = option.value.split('-').map(Number);

            if (option.value === '200+') {
                if (capacity >= 200) {
                    validOptions.push(option);
                }
            } else if (capacity >= min && capacity <= max) {
                validOptions.push(option);
            } else if (capacity > min) {
                validOptions.push(option);
            }
        });

        return validOptions;
    });

    const toggleDateModal = () => {
        if (!dateModalToggled.value) {
            newReserveDates.value = [...reserveDates.value];
        }

        dateModalToggled.value = !dateModalToggled.value;
    }

    const toggleAttendeesModal = () => {
        if (!attendeesModalToggled.value) {
            newAttendees.value = attendees.value;
        }

        attendeesModalToggled.value = !attendeesModalToggled.value;
    }

    const changeDates = () => {
        if (!newReserveDates.value || newReserveDates.value.length < 2) {
            newDatesError.value = "Please select 2 dates."
            return;
        }

        newDatesError.value = "";
        reserveDates.value = [...newReserveDates.value];
        dateModalToggled.value = false;
    }

    const changeAttendees = () => {
        let isNotValid = true;

        validAttendeeOptions.value.forEach(option => {
            if (newAttendees.value === option.value) {
                isNotValid = false;
            }
        });

        if (isNotValid) {
            newAttendeesError.value = "Please enter a valid number of attendees."
            return;
        }

        newAttendeesError.value = "";
        attendees.value = newAttendees.value;
        attendeesModalToggled.value = false;
    }

    watch(dateModalToggled, (isOpen) => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.backgroundColor = '#0000000d';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });

    watch(attendeesModalToggled, (isOpen) => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.backgroundColor = '#0000000d';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });

    onUnmounted(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
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
                            <!-- TODO: needs to be the host's pfp -->
                            <img class="figCaptionImg" :src="user?.pfp || '/images/profile_4.jpeg'" alt="host pfp" >
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
                    <button type="submit" class="btn custom-btn confirm" @click="book">Book</button>
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
                        <button
                            type="button"
                            class="border-0 text-decoration-underline"
                            @click="toggleDateModal"
                        >
                            Edit
                        </button>
                    </div>
                    <div class="d-flex justify-content-between details">
                        <span>
                            <span class="fw-medium">Attendees:</span> 
                            {{ attendees }}
                        </span>
                        <button
                            type="button"
                            class="border-0 text-decoration-underline"
                            @click="toggleAttendeesModal"
                        >
                            Edit
                        </button>
                    </div>
                </div>
                <div class="info border-bottom border-black pb-4 pt-4">
                    <h3>Price Details</h3>
                    <div class="d-flex justify-content-between details">
                        <span>${{ parseFloat(venuePrice).toFixed(2) }} x {{ calculateDays }} days</span>
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

        <div v-if="dateModalToggled" class="overlay">
            <div class="popup bg-light">
                <button class="close-btn" @click="toggleDateModal">
                    &times;
                </button>

                <div>
                    <h3>Edit Dates</h3>
                    <div class="d-flex flex-column gap-1">
                        <VueDatePicker
                            v-model="newReserveDates"
                            type="date"
                            range
                            placeholder="mm/dd/yyyy - mm/dd/yyyy"
                            :min-date="new Date()"
                            :enable-time-picker="false"
                        />
                        <div v-if="newDatesError">
                            <span class="text-danger">
                                {{ newDatesError }}
                            </span>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn confirm"
                            @click="changeDates"
                        >
                            Save
                        </button>
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn cancel"
                            @click="toggleDateModal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="attendeesModalToggled" class="overlay">
            <div class="popup bg-light">
                <button class="close-btn" @click="toggleAttendeesModal">
                    &times;
                </button>

                <div>
                    <h3>Edit Attendees</h3>
                    <div class="d-flex flex-column gap-1">
                        <select
                            class="form-select attendees-no-box-shadow"
                            id="attendees"
                            v-model="newAttendees"
                            required
                        >
                            <option 
                                v-for="option in validAttendeeOptions" 
                                :key="option.value" 
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                        <div v-if="newAttendeesError">
                            <span class="text-danger">
                                {{ newAttendeesError }}
                            </span>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn confirm"
                            @click="changeAttendees"
                        >
                            Save
                        </button>
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn cancel"
                            @click="toggleAttendeesModal"
                        >
                            Cancel
                        </button>
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

    .figCaptionImg {
        height: 35px;
        width: 35px;
        border-radius: 50%;
        margin-right: 0.25rem;
    }

    .short-border {
        border-bottom: 1px solid black;
        width: 90%;
        margin: 0.5rem auto;
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

    .primary-color {
        color: var(--primary);
    }

    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
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
</style>