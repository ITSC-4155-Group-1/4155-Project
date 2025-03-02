<template>
    <div class="venue-details-wrapper">
        <div class="venue-details">
            <h1>{{ venue.venue_name }}</h1>
            <h2>{{ venue.location }}</h2>
            
            <img v-if="venue.image && venue.image.length" :src="venue.image[0]" alt="Venue image" class="venue-image">
            <p v-else>No image available</p>

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
                    
                    <!-- Start Date -->
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
                            <option value="5+">5+</option>
                            <option value="10+">10+</option>
                            <option value="25+">25+</option>
                            <option value="50+">50+</option>
                            <option value="100+">100+</option>
                        </select>
                        <div class="invalid-feedback" v-if="!attendees">
                            Please select the number of attendees.
                        </div>
                    </div>

                        <!-- Price Calculation -->
                    <div class="booking-item">
                        <strong>Price:</strong> 
                        <span v-if="startDate && endDate">${{ venue.price }}</span>
                        <span v-else>Select a date</span>
                    </div>

                    <!-- Total (Including Cleaning Fee) -->
                    <div class="booking-item total">
                        <strong>Total:</strong> 
                        <span v-if="startDate && endDate">${{ venue.price }}</span>
                        <span v-else>Select a date</span>
                    </div>

                    <!-- Submit Button -->
                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn px-4" type="submit">Book Now</button>
                    </div>
                </form>
            </div>

            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </div>
    </div>
</template>

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
const cleaningFee = 50;
const successMessage = ref('');

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

// Booking Date Range
const minDate = computed(() => venue.value.availability_start_date ? new Date(venue.value.availability_start_date) : new Date());
const maxDate = computed(() => venue.value.availability_end_date ? new Date(venue.value.availability_end_date) : null);

const submitBooking = () => {
    if (!startDate.value || !endDate.value || !attendees.value) {
        alert("Please fill out all required fields.");
        return;
    }
    successMessage.value = "Your booking has been successfully submitted!";
};

const toggleCollapse = (index) => {
    collapsibleSections[index].isOpen = !collapsibleSections[index].isOpen;
};

</script>

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

.rating {
    font-size: 14px;
    color: var(--highlight);
    font-size: 16px;
    font-weight: bolder;
    border-radius: 0 0 0.5rem 0;
    padding: 10px;
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
    font-size: 18px;
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
    border: 2px solid #ff4081;
    color: #FF4081;
    width: 420px;
    align-items: center;
}

.btn:hover {
    background-color: #ff4081;
}

.card-body {
    width: 600px;
    background-color: #dcdcdc;
}

.collapsible {
    background-color: #f1f1f1;
    color: #444;
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

</style>
