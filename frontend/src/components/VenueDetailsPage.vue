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

            <p>
                <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseParking" role="button" aria-expanded="false" aria-controls="collapseParking">
                    Parking
                </a>
            </p>
            <div class="collapse" id="collapseParking">
                <div class="card card-body">
                    Some placeholder content for parking information.
                </div>
            </div>

            <p>
                <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseRules" role="button" aria-expanded="false" aria-controls="collapseRules">
                    Host Rules
                </a>
            </p>
            <div class="collapse" id="collapseRules">
                <div class="card card-body">
                    Some placeholder content for host rules.
                </div>
            </div>

            <p>
                <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseCancel" role="button" aria-expanded="false" aria-controls="collapseCancel">
                    Cancellation Policy
                </a>
            </p>
            <div class="collapse" id="collapseCancel">
                <div class="card card-body">
                    Some placeholder content for the cancellation policy.
                </div>
            </div>

            <p>
                <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseHours" role="button" aria-expanded="false" aria-controls="collapseHours">
                    Operational Hours
                </a>
            </p>
            <div class="collapse" id="collapseHours">
                <div class="card card-body">
                    Some placeholder content for operational hours.
                </div>
            </div>

            <p>
                <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseLocation" role="button" aria-expanded="false" aria-controls="collapseLocation">
                    Location
                </a>
            </p>
            <div class="collapse" id="collapseLocation">
                <div class="card card-body">
                    Some placeholder content for location details.
                </div>
            </div>

            <p><strong>Price:</strong> ${{ venue.price }} per day</p>
            <p><strong>Capacity:</strong> {{ venue.capacity }} people</p>
            <p><strong>Availability:</strong> From {{ formattedStartDate }} to {{ formattedEndDate }}</p>

            <!-- Booking Form Container -->
            <div class="booking-form-container">
                <form class="row g-3 needs-validation" novalidate @submit.prevent="submitBooking">
                    <!-- Start Date -->
                    <div class="col-md-6">
                        <label for="startDate" class="form-label">Start Date:</label>
                        <input 
                            type="date" 
                            class="form-control" 
                            id="startDate" 
                            v-model="startDate" 
                            :min="minDate" 
                            :max="maxDate" 
                            required
                        >
                        <div class="invalid-feedback" v-if="!startDate">
                            Please select a valid start date.
                        </div>
                    </div>

                    <!-- End Date -->
                    <div class="col-md-6">
                        <label for="endDate" class="form-label">End Date:</label>
                        <input 
                            type="date" 
                            class="form-control" 
                            id="endDate" 
                            v-model="endDate" 
                            :min="startDate" 
                            :max="maxDate" 
                            required
                        >
                        <div class="invalid-feedback" v-if="!endDate">
                            Please select a valid end date.
                        </div>
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

                    <!-- Submit Button -->
                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn-warning px-4" type="submit">Book Now</button>
                    </div>
                </form>
            </div>

            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { venues } from '../../../mockdata.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const venue = ref({});
const startDate = ref('');
const endDate = ref('');
const attendees = ref('');
const successMessage = ref('');

onMounted(() => {
    const venueId = route.params.id;
    venue.value = venues.find(v => v.host_id === venueId);
});

// Date Formatting
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const formattedStartDate = computed(() => venue.value.availability_start_date ? formatDate(venue.value.availability_start_date) : '');
const formattedEndDate = computed(() => venue.value.availability_end_date ? formatDate(venue.value.availability_end_date) : '');

// Booking Date Range
const minDate = computed(() => venue.value.availability_start_date ? venue.value.availability_start_date : '');
const maxDate = computed(() => venue.value.availability_end_date ? venue.value.availability_end_date : '');

const submitBooking = () => {
    if (!startDate.value || !endDate.value || !attendees.value) {
        alert("Please fill out all required fields.");
        return;
    }
    successMessage.value = "Your booking has been successfully submitted!";
};
</script>

<style scoped>
.venue-details {
    padding: 40px;
    margin-top: 60px;
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
    height: 550px;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    border-radius: 8px;
    z-index: 1000; /* Ensures it stays on top */
}

.form-label {
    font-size: 20px;
    font-weight: bold;
}

.btn-warning {
    background-color: #ffc107;
    border: none;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.card-body {
    width: 600px;
    background-color: #dcdcdc;
}
</style>
