<script setup>
    import { ref, nextTick } from 'vue';
    import { showSuccessToast, showErrorToast } from '../utils/toast';
    import { useRouter } from 'vue-router';

    const form = ref({
        state: "",
        city: "",
        address: "",
        zipCode: null,
        venueName: "",
        description: "",
        price: 0,
        availability: [],
        capacity: 0,
        images: null,
    });

    const addressError = ref(false);
    const router = useRouter();

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files) {
            form.value.images = Array.from(files);
        }
    }

    const usStatesCities = {
        "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
        "Alaska": ["Anchorage", "Fairbanks", "Juneau"],
        "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler"],
        "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville"],
        "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
        "Colorado": ["Denver", "Colorado Springs", "Aurora"],
        "Connecticut": ["Bridgeport", "New Haven", "Hartford"],
        "Delaware": ["Wilmington", "Dover", "Newark"],
        "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
        "Georgia": ["Atlanta", "Augusta", "Savannah"],
        "Hawaii": ["Honolulu", "Hilo", "Kailua"],
        "Idaho": ["Boise", "Nampa", "Idaho Falls"],
        "Illinois": ["Chicago", "Springfield", "Peoria"],
        "Indiana": ["Indianapolis", "Fort Wayne", "Evansville"],
        "Iowa": ["Des Moines", "Cedar Rapids", "Davenport"],
        "Kansas": ["Wichita", "Topeka", "Overland Park"],
        "Kentucky": ["Louisville", "Lexington", "Bowling Green"],
        "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport"],
        "Maine": ["Portland", "Augusta", "Bangor"],
        "Maryland": ["Baltimore", "Annapolis", "Frederick"],
        "Massachusetts": ["Boston", "Worcester", "Springfield"],
        "Michigan": ["Detroit", "Grand Rapids", "Lansing"],
        "Minnesota": ["Minneapolis", "Saint Paul", "Rochester"],
        "Mississippi": ["Jackson", "Gulfport", "Biloxi"],
        "Missouri": ["Kansas City", "Saint Louis", "Springfield"],
        "Montana": ["Billings", "Missoula", "Great Falls"],
        "Nebraska": ["Omaha", "Lincoln", "Bellevue"],
        "Nevada": ["Las Vegas", "Reno", "Henderson"],
        "New Hampshire": ["Manchester", "Nashua", "Concord"],
        "New Jersey": ["Newark", "Jersey City", "Paterson"],
        "New Mexico": ["Albuquerque", "Santa Fe", "Las Cruces"],
        "New York": ["New York City", "Buffalo", "Rochester"],
        "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
        "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
        "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
        "Oklahoma": ["Oklahoma City", "Tulsa", "Norman"],
        "Oregon": ["Portland", "Eugene", "Salem"],
        "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown"],
        "Rhode Island": ["Providence", "Warwick", "Cranston"],
        "South Carolina": ["Charleston", "Columbia", "Greenville"],
        "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
        "Tennessee": ["Nashville", "Memphis", "Knoxville"],
        "Texas": ["Houston", "San Antonio", "Dallas", "Austin"],
        "Utah": ["Salt Lake City", "Provo", "Ogden"],
        "Vermont": ["Burlington", "Montpelier", "Rutland"],
        "Virginia": ["Virginia Beach", "Richmond", "Norfolk"],
        "Washington": ["Seattle", "Spokane", "Tacoma"],
        "West Virginia": ["Charleston", "Huntington", "Morgantown"],
        "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
        "Wyoming": ["Cheyenne", "Casper", "Laramie"]
    };

    const errors = ref({
        state: false,
        city: false,
        address: false,
        zipCode: false,
        venueName: false,
        description: false,
        price: false,
        capacity: false,
        availability: false,
        images: false,
    });

    const validateForm = () => {
        errors.value.state = !form.value.state;
        errors.value.city = !form.value.city;
        errors.value.address = form.value.address.trim().length < 4;
        errors.value.zipCode = !form.value.zipCode || form.value.zipCode.length < 5 || form.value.zipCode.length > 9;
        errors.value.venueName = form.value.venueName.trim().length <= 0;
        errors.value.description = form.value.description.trim().length < 10;
        errors.value.price = form.value.price < 0 || form.value.price > 100000;
        errors.value.capacity = form.value.capacity <= 0;
        errors.value.availability = form.value.availability[0] == null || form.value.availability[1] == null;
        errors.value.images = !form.value.images || form.value.images.length === 0;

        return !Object.values(errors.value).includes(true); // true if all error values are true
    }

    const createVenue = async () => {
        if (!validateForm()) {
            showErrorToast('Missing required information.')
            return;
        }

        // TODO: make api call to create the venue
        // if successful, show the successful toast, else show the error toast
        try {
            await router.push('/settings');

            nextTick(() => {
                showSuccessToast('Venue created successfully!');
            })
        } catch (error) {
            showErrorToast('Failed to create venue. Please try again.');
        }
    };
</script>

<template>
    <div class="form-width mx-auto">
        <h1 class="text-center mt-2 mb-5 provide-space-color">Provide a Space</h1>
        <form @submit.prevent="createVenue" class="mb-3">
            <div class="mb-5">
                <h3>Location</h3>
                <div class="d-flex gap-2">
                    <div class="mb-3 w-50">
                        <label for="state" class="form-label">State</label>
                        <select
                            class="form-select"
                            aria-label="state"
                            id="state"
                            name="state"
                            v-model="form.state"
                            required
                        >
                            <option value="" selected disabled>State</option>
                            <option
                                v-for="(city, state) in usStatesCities"
                                :value="state"
                                :key="state"
                            >
                                {{ state }}
                            </option>
                        </select>
                        <div v-if="errors.state" class="text-danger mt-1">
                            Please select a state.
                        </div>
                    </div>
                    <div class="mb-3 w-50">
                        <label for="city" class="form-label">
                            City {{ form.state ? 'in ' + form.state : '' }}
                        </label>
                        <select
                            v-model="form.city"
                            :disabled="!form.state"
                            class="form-select"
                            aria-label="city"
                            id="city"
                            name="city"
                            required
                        >
                            <option value="" selected disabled>City</option>
                            <option
                                v-for="city in usStatesCities[form.state]"
                                :value="city"
                                :key="city"
                            >
                                {{ city }}
                            </option>
                        </select>
                        <div v-if="errors.city" class="text-danger mt-1">
                            Please select a city.
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="mb-3 w-50">
                        <label for="address" class="form-label">Address</label>
                        <input
                            v-model="form.address"
                            :disabled="!form.city"
                            type="text"
                            class="form-control"
                            id="address"
                            name="address"
                            minlength="4"
                            aria-describedby="address"
                            placeholder="123 Country Road"
                            required
                            :class="{ 'is-invalid': addressError }"
                        >
                        <div v-if="errors.address" class="text-danger mt-1">
                            Please enter a valid address (e.g., "123 Main St").
                        </div>
                    </div>
                    <div class="mb-3 w-50">
                        <label for="zip_code" class="form-label">Zip Code</label>
                        <input
                            v-model="form.zipCode"
                            :disabled="!form.address"
                            type="number"
                            class="form-control"
                            id="zip_code"
                            name="zip_code"
                            minlength="5"
                            maxlength="9"
                            aria-describedby="zip_code"
                            placeholder="12345"
                            pattern="[0-9]{5}"
                            required
                        >
                        <div v-if="errors.zipCode" class="text-danger mt-1">
                            Please enter a valid zip code (5 to 9 digits long).
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Venue Details</h3>
                <div class="mb-3">
                    <label for="venue_name" class="form-label">Venue Name</label>
                    <input
                        v-model="form.venueName"
                        :disabled="!form.zipCode"
                        type="text"
                        class="form-control"
                        id="venue_name"
                        name="venue_name"
                        aria-describedby="venue_name"
                        minlength="1"
                        placeholder="Enter venue name"
                        required
                    >
                    <div v-if="errors.venueName" class="text-danger mt-1">
                            Please enter a venue name.
                    </div>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Venue Description</label>
                    <textarea
                        v-model="form.description"
                        :disabled="!form.venueName"
                        class="form-control"
                        minlength="10"
                        placeholder="Provide a short description of the venue"
                        id="description"
                        name="description"
                        required
                    ></textarea>
                    <div v-if="errors.description" class="text-danger mt-1">
                            Please enter a description that is at least 10 characters long.
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="mb-3 w-50">
                        <label for="price" class="form-label">Price per day (USD)</label>
                        <input
                            v-model="form.price"
                            :disabled="!form.description"
                            type="number"
                            step="100"
                            class="form-control"
                            placeholder="80"
                            id="price"
                            name="price"
                            required
                            min="0"
                            max="100000"
                        >
                        <div v-if="errors.price" class="text-danger mt-1">
                            Please enter a valid price (USD) between 0 and 100,000.
                        </div>
                    </div>
                    <div class="mb-3 w-50">
                        <label for="capacity" class="form-label">Max Capacity</label>
                        <input
                            v-model="form.capacity"
                            :disabled="!form.price"
                            type="number"
                            step="1"
                            class="form-control"
                            placeholder="15"
                            id="capacity"
                            name="capacity"
                            required
                            min="1"
                            max="150000"
                        >
                        <div v-if="errors.capacity" class="text-danger mt-1">
                            Please enter a valid capacity (between 1 and 150,000).
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="date" class="form-label">Availability</label>
                    <VueDatePicker
                        v-model="form.availability"
                        :disabled="!form.capacity"
                        type="date"
                        range
                        placeholder="mm/dd/yyyy - mm/dd/yyyy"
                        :min-date="new Date()"
                        :enable-time-picker="false"
                    />
                    <div v-if="errors.availability" class="text-danger mt-1">
                        Please select a start and end date.
                    </div>
                </div>
                <div class="mb-3">
                    <label for="image" class="form-label">Venue Image(s)</label>
                    <input
                        type="file"
                        class="form-control"
                        id="image"
                        name="image"
                        accept="image/png, image/jpg, image/jpeg"
                        multiple
                        required
                        @change="handleFileUpload"
                        :disabled="form.availability.length !== 2"
                    >
                    <div class="form-text" v-if="errors.images === false">
                        Please provide at least one image.
                    </div>
                    <div v-else class="text-danger mt-1">
                        Please provide at least one image
                    </div>
                </div>
            </div>
            <button
                type="submit"
                class="btn w-100"
                :disabled="form.images == null"
            >Submit</button>
        </form>
    </div>
</template>

<style scoped>
    .provide-space-color {
        color: var(--primary);
    }

    .form-width {
        width: 65%;
    }

    textarea {
        height: 200px;
    }

    .preview-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
    }

    button[type="submit"] {
        background-color: var(--highlight);
        color: white;
        transition: background-color 0.2s ease-in-out;
    }
    
    button[type="submit"]:hover {
        background-color: var(--highlight-dark-50);
    }

    input::placeholder, textarea::placeholder, select:invalid {
        color: var(--secondary);
    }
</style>