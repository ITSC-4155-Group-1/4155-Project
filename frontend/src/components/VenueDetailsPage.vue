<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue';
    import { venues } from '../../../mockdata.js';
    import { useRoute } from 'vue-router';
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    const route = useRoute();
    const venue = ref({});
    const dateRange = ref(null);
    const attendees = ref('');
    const cleaningFee = 200;
    const processing = 50;
    const successMessage = ref('');

    const minDate = computed(() => venue.value.availability_start_date ? new Date(venue.value.availability_start_date) : new Date());
    const maxDate = computed(() => venue.value.availability_end_date ? new Date(venue.value.availability_end_date) : null);

    const collapsibleSections = ref([
        { title: "Parking", content: "Parking details here." },
        { title: "Host Rules", content: "Rules for the venue." },
        { title: "Cancellation Policy", content: "Details about cancellations." },
        { title: "Operational Hours", content: "Opening and closing times." },
        { title: "Location", content: "Exact venue location." }
    ]);

    onMounted(() => {
        const venueId = route.params.id;
        venue.value = venues.find(v => v.host_id === venueId);

        nextTick(() => {
            const coll = document.getElementsByClassName("collapsible");
            for (let i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    let content = this.nextElementSibling;
                    content.style.display = content.style.display === "block" ? "none" : "block";
                });
            }
        });
    });

    const submitBooking = () => {
        if (!startDate.value || !endDate.value || !attendees.value) {
            alert("Please fill out all required fields.");
            return;
        }
        successMessage.value = "Your booking has been successfully submitted!";
    };

    const calculateDays = computed(() => {
        if (dateRange.value && dateRange.value.length === 2) {
            const start = new Date(dateRange.value[0]);
            const end = new Date(dateRange.value[1]);
            const diffTime = end - start;
            return Math.max(1, diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    });

    const isFormValid = computed(() => {
        return dateRange.value && dateRange.value.length === 2 && attendees.value;
    });


    const toggleCollapse = (index) => {
        collapsibleSections[index].isOpen = !collapsibleSections[index].isOpen;
    };
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
            <div v-for="(section, index) in collapsibleSections" :key="index">
                <button type="button" class="collapsible">
                    {{ section.title }}
                </button>
                <div class="content">
                    <p>{{ section.content }}</p>
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
                        <span v-if="dateRange && dateRange.length === 2">${{ venue.price * calculateDays }}</span>
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
                        <strong v-if="dateRange && dateRange.length === 2">${{ (venue.price * calculateDays) + cleaningFee + processing}}</strong>
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

    .collapsible {
        background-color: #f1f1f1;
        cursor: pointer;
        padding: 10px;
        width: 600px;
        border: none;
        text-align: left;
        font-size: 20px;
        font-weight: medium;
        transition: background-color 0.3s;
        margin-bottom: 5px;
    }

    .collapsible:hover {
        background-color: #ddd;
    }

    .content {
        padding: 0 15px;
        display: none;
        overflow: hidden;
        background-color: #f1f1f1;
    }

    .form-select {
        width: 405px;
    }
</style>
