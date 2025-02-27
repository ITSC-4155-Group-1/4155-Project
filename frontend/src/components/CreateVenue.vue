<script setup>
    import { ref } from 'vue';

    const date = ref([]); // date[0] -> start date, date[1] -> end date

    const selectedState = ref("");
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

    console.log(date.value)
</script>

<template>
    <!-- 
        idea: the user must fill the previous input before moving on in the form
                the following input will disabled until the following input is filled
    -->
    <form action="#" method="POST" class="form-width mx-auto mb-3">
        <div class="mb-3">
            <label for="state" class="form-label">State</label>
            <select
                class="form-select"
                aria-label="state"
                id="state"
                name="state"
                v-model="selectedState"
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
        <div class="mb-3">
            <label for="city" class="form-label">
                City {{ selectedState ? 'in ' + selectedState : '' }}
            </label>
            <select class="form-select" aria-label="city" id="city" name="city" required>
                <option value="" selected disabled>City</option>
                <option
                    v-for="city in usStatesCities[selectedState]"
                    :value="city"
                    :key="city"
                >
                    {{ city }}
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                aria-describedby="address"
                placeholder="123 Country Road"
                required
            >
        </div>
        <div class="mb-3">
            <label for="venue_name" class="form-label">Venue Name</label>
            <input
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
            <label for="details" class="form-label">Venue Description</label>
            <textarea
                class="form-control"
                placeholder="Provide a short description of the venue"
                id="details"
                name="details"
                required
            ></textarea>
        </div>
        <div class="mb-3">
            <label for="price" class="form-label">Price per day (USD)</label>
            <input
                type="number"
                step="1"
                class="form-control"
                placeholder="80"
                id="price"
                name="price"
                required
            >
        </div>
        <div class="mb-3">
            <label for="date" class="form-label">Availability</label>
            <VueDatePicker
                v-model="date"
                type="date"
                range
                placeholder="mm/dd/yyyy - mm/dd/yyyy"
                :min-date="new Date()"
                :enable-time-picker="false"
            />
        </div>
        <div class="mb-3">
            <label for="capacity" class="form-label">Max Capacity</label>
            <input
                type="number"
                step="1"
                class="form-control"
                placeholder="15"
                id="capacity"
                name="capacity"
                required
            >
        </div>
        <button type="submit" class="btn w-100">Submit</button>
    </form>

</template>

<style scoped>
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