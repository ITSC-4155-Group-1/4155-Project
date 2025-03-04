<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { venues } from '../../../mockdata.js';
    import { useRouter, useRoute } from 'vue-router';
    import { useCartStore } from '../store/cartStore';

    const router = useRouter();
    const cartStore = useCartStore();

    const route = useRoute();
    const venue = ref({});
    const dateRange = ref(null);
    const attendees = ref('');
    const cleaningFee = 200;
    const processing = 50;
    const successMessage = ref('');
    const total = ref(0);

    const minDate = computed(() => venue.value.availability_start_date ? new Date(venue.value.availability_start_date) : new Date());
    const maxDate = computed(() => venue.value.availability_end_date ? new Date(venue.value.availability_end_date) : null);

    const collapsibleSections = ref([
        { title: "Parking", content: "Ample parking space is available on-site. Parking is free for the first 2 hours, after which a small fee is applied." },
        { title: "Host Rules", content: "Hosts must ensure that guests follow safety protocols. No loud music after 10 PM. Alcohol consumption is allowed in designated areas only." },
        { title: "Cancellation Policy", content: "Cancellations made 14 days prior to the event date will receive a full refund. After that, a 50% refund will be issued if cancelled within 7 days." },
        { title: "Operational Hours", content: "The venue operates from 9 AM to 11 PM daily. Special hours may apply for holidays or special events." },
        { title: "Location", content: "Exact venue location." }
    ]);

    onMounted(() => {
        const venueId = route.params.id;
        venue.value = venues.find(v => v.host_id === venueId);
    });

    const submitBooking = () => {
        if (!dateRange.value || dateRange.value.length !== 2  || !attendees.value) {
            alert("Please fill out all required fields.");
            return;
        }
        successMessage.value = "Your booking has been successfully submitted!";

        cartStore.setCartDetails({
            host: venue.value.host_id,
            venueName: venue.value.venue_name,
            venuePrice: venue.value.price,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
            attendees: attendees.value,
            cleaningFee: cleaningFee,
            processing: processing,
            image: venue.value.image.join(','),
        })

        router.push('/cart')
    };

    const calculateDays = computed(() => {
        if (dateRange.value && dateRange.value.length === 2) {
            const start = new Date(dateRange.value[0]);
            const end = new Date(dateRange.value[1]);
            const diffTime = end - start;
            return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
        return 0;
    });

    const totalPrice = computed(() => {
        if (!venue.value || !venue.value.price || calculateDays.value === 0) {
            return 0;
        }

        total.value = (venue.value.price * calculateDays.value) + cleaningFee + processing;
        return parseFloat(total.value).toFixed(2);
    });

    const isFormValid = computed(() => {
        return dateRange.value && dateRange.value.length === 2 && attendees.value;
    });
</script>

<template>
    <div class="venue-details-wrapper">
        <div class="venue-details">
            <h1>{{ venue.venue_name }}</h1>
            <h2>{{ venue.location }}</h2>
            
            <img v-if="venue.image && venue.image.length" :src="venue.image[0]" alt="Venue image" class="venue-image">
            <p v-else>No image available</p>
            <div class="rating-capacity-container">
                <div v-if="venue.rating" class="rating">
                    <span class="rating p-2">
                        <span> 
                            <svg width="23" height="23" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                                    fill="none" stroke="#FFC107" stroke-width="1"/>
                            </svg>
                        </span>
                        {{ venue.rating }} / 5.0 
                    </span>
                </div>

                <div class="capacity">
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="7" r="4"/>  <!-- Head -->
                        <path d="M4 21v-2c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v2" />  <!-- Body -->
                    </svg>
                    {{ venue.capacity }}
                </div>
            </div>  

            <div class = "host">
                <p>Hosted by {{ host_id }}</p>
            </div>

            <p><strong>About the space</strong></p>
            <p class="venue-description">{{ venue.venue_description }}</p>
            
            <!-- Collapsible Sections -->
            <div class="accordionContainer" v-for="(section, index) in collapsibleSections" :key="index">
                <div class="accordion" :id="'accordionExample' + index">
                    <div class="accordion-item">
                        <h2 class="accordion-header" :id="'heading' + index">
                            <button 
                                class="accordion-button custom-accordion-button collapsed"
                                type="button" 
                                :data-bs-toggle="'collapse'" 
                                :data-bs-target="'#collapse' + index" 
                                :aria-expanded="false"
                                :aria-controls="'collapse' + index">
                                {{ section.title }}
                            </button>
                        </h2>
                        <div 
                            :id="'collapse' + index" 
                            class="accordion-collapse collapse"
                            :class="{'show': index === 0}"
                            :data-bs-parent="'#accordionExample' + index">
                            <div class="accordion-body">
                                {{ section.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- Booking Form Container -->
            <div class="booking-form-container">
                <form class="row g-3 needs-validation" novalidate @submit.prevent="submitBooking">
                    
                    <!-- Date -->
                    <div class="col-12">
                        <label for="dateRange" class="form-label">Select Dates:</label>
                        <VueDatePicker
                            v-model="dateRange"
                            range
                            placeholder="mm/dd/yyyy - mm/dd/yyyy"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :enable-time-picker="false"
                        />
                    </div>

                    <!-- Attendees -->
                    <div class="col-md-6">
                        <label for="attendees" class="form-label">Attendees</label>
                        <select class="form-select" id="attendees" v-model="attendees" required>
                            <option selected disabled value="">Choose...</option>
                            <option value="1-40">1-40</option>
                            <option value="41-100">41-100</option>
                            <option value="101-200">101-200</option>
                            <option value="200+">200+</option>
                        </select>
                        <div class="invalid-feedback" v-if="!attendees">
                            Please select the number of attendees.
                        </div>
                    </div>

                    <!-- Price Calculation -->
                    <label for="price" class="form-label">Price</label>
                    <div class="booking-item">
                        <span v-if="dateRange && dateRange.length === 2">${{ venue.price }} x {{ calculateDays }} days</span>
                        <span v-else>--</span>
                        <span v-if="dateRange && dateRange.length === 2">${{ parseFloat(venue.price * calculateDays).toFixed(2) }}</span>
                        <span v-else>--</span>
                    </div>

                    <div class="booking-item">
                        <span>Cleaning Fee</span>
                        <span>${{ cleaningFee }}</span>
                    </div>

                    <div class="booking-item">
                        <span>Processing</span>
                        <span>${{ processing }}</span>
                    </div>

                    <!-- Total -->
                    <div class="booking-item total">
                        <strong>Total:</strong> 
                        <strong v-if="dateRange && dateRange.length === 2">${{ totalPrice }}</strong>
                        <strong v-else>--</strong>
                    </div>

                    <!-- Submit Button -->
                    <div class="col-12 d-flex justify-content-end">
                        <button 
                            class="btn btn px-4"
                            type="submit"
                            :class="{ 'btn-active': isFormValid }"
                            :disabled="!isFormValid"
                        >
                            Book Now
                        </button>
                    </div>
                </form>
            </div>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
    .venue-details {
        padding: 40px;
    }

    .venue-image {
        width: 50%;
        height: auto;
    }

    h1 {
        font-size: 28px;
        font-weight: semi-bold;
        color: var(--primary);
    }
    h2 {
        font-size: 20px;
        font-weight: semi-bold;
        color: #757575;
    }

    p {
        color: black;
        font-size: 20px;
        font-weight: semi-bold;

    }

    .venue-description {
        color: black;
        font-size: 16px;
        font-weight: regular;
        max-width: 620px;
        word-wrap: break-word;
        white-space: normal;
    }

    .rating-capacity-container {
        display: flex;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
        gap: 25px;
    }
    .rating {
        color: var(--highlight);
        font-size: 16px;
        font-weight: bold;
    }

    .capacity {
        font-size: 16px;
        font-weight: bold;
        color: black;
    }

    .host {
        margin-bottom: 50px;
        font-size: 16px;
        font-weight: bold;
        color: black;
    }

    .booking-form-container {
        position: fixed;
        top: 50%;
        right: 80px;
        transform: translateY(-50%);
        width: 450px;
        height: auto;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        border-radius: 25px;
        border: 2px solid #000000;
        z-index: 1000;
    }

    .booking-item {
        font-size: 16px;
        font-weight: regular;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .booking-item.total {
        font-weight: bold;
        font-size: 20px;
        border-top: 2px solid #ccc;
        padding-top: 10px;
    }

    .form-label {
        font-size: 20px;
        font-weight: bold;
    }

    .btn {
        background-color: white;
        border: 2px solid #FF4081;
        color: #FF4081;
        width: 420px;
        align-items: center;
        cursor: not-allowed;
        opacity: 0.5;
        transition: background-color 0.3s ease, opacity 0.3s ease;
    }

    .btn-active {
        background-color: #FF4081 !important;
        color: white !important;
        cursor: pointer;
        opacity: 1;
    }

    .btn-active:hover {
        background-color: #e03070 !important;
    }

    .card-body {
        width: 600px;
        background-color: #dcdcdc;
    }

    .content {
        padding: 0 15px;
        display: none;
        overflow: hidden;
        background-color: #f1f1f1;
        font-size: 16px;
    }

    .form-select {
        width: 405px;
    }

    .accordionContainer {
        width: 600px;
    }

    .custom-accordion-button {
        background-color: #f1f1f1;
        border: none !important;
        box-shadow: none !important;
        color: black !important;
}

    .custom-accordion-button:not(.collapsed) {
        background-color: #f1f1f1;
    }

    .accordion-item {
        border: none !important;
    }
</style>
