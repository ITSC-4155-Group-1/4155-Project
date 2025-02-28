<script setup>
    import { ref } from 'vue';

    const form = ref({
        state: "",
        city: "",
        address: "",
        venueName: "",
        description: "",
        price: 0,
        availability: [],
        capacity: 0,
    });

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
</script>

<template>
    <div class="form-width mx-auto">
        <h1 class="text-center mt-2 mb-5 provide-space-color">Provide a Space</h1>
        <form action="#" method="POST" class="mb-3">
            <div class="mb-5">
                <h2 class="form-description">Location</h2>
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
                    </div>
                    <div class="mb-3 w-50">
                        <label for="city" class="form-label">
                            City {{ selectedState ? 'in ' + selectedState : '' }}
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
                    </div>
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <input
                        v-model="form.address"
                        :disabled="!form.city"
                        type="text"
                        class="form-control"
                        id="address"
                        name="address"
                        aria-describedby="address"
                        placeholder="123 Country Road"
                        required
                    >
                </div>
            </div>
            <div class="">
                <h2 class="form-description">Venue Details</h2>
                <div class="mb-3">
                    <label for="venue_name" class="form-label">Venue Name</label>
                    <input
                        v-model="form.venueName"
                        :disabled="!form.address"
                        type="text"
                        class="form-control"
                        id="venue_name"
                        name="venue_name"
                        aria-describedby="venue_name"
                        placeholder="Enter venue name"
                        required
                    >
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Venue Description</label>
                    <textarea
                        v-model="form.description"
                        :disabled="!form.venueName"
                        class="form-control"
                        placeholder="Provide a short description of the venue"
                        id="description"
                        name="description"
                        required
                    ></textarea>
                </div>
                <div class="d-flex gap-2">
                    <div class="mb-3 w-50">
                        <label for="price" class="form-label">Price per day (USD)</label>
                        <input
                            v-model="form.price"
                            :disabled="!form.description"
                            type="number"
                            step="1"
                            class="form-control"
                            placeholder="80"
                            id="price"
                            name="price"
                            required
                            min="0"
                            max="10000000"
                        >
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
                </div>
            </div>
            <button type="submit" class="btn w-100">Submit</button>
        </form>
    </div>
</template>

<style scoped>
    .provide-space-color {
        color: var(--primary);
    }

    .form-description {
        color: var(--accent);
    }

    .form-width {
        width: 65%;
    }

    textarea {
        height: 200px;
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