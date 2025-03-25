<script setup>
    import { venues } from "../../../mockdata";
    import { ref } from "vue"
    import VenueCard from "./VenueCard.vue"

    const venueList = ref(venues);

    const searchQuery = ref({
        location: '',
        date: '',
        attendees: ''
    });

    // note to self: we're returning true either way because the queries can be empty (have fun deciphering this)
    const search = () => {
        venueList.value = venues.filter(venue => {
            const locationMatch = searchQuery.value.location 
                ? venue.location.toLowerCase().includes(searchQuery.value.location.toLowerCase()) 
                : true;
            
            const dateMatch = searchQuery.value.date
                ? searchQuery.value.date >= venue.availability_start_date && searchQuery.value.date <= venue.availability_end_date
                : true;

            const attendeesMatch = searchQuery.value.attendees
                ? filterAttendees(venue.capacity, searchQuery.value.attendees)
                : true;

            return locationMatch && dateMatch && attendeesMatch;
        });
    };

    const filterAttendees = (venueAttendees, groupSize) => {
        switch (groupSize) {
            case "small-group": return venueAttendees >= 1 && venueAttendees <= 40;
            case "medium-group": return venueAttendees >= 41 && venueAttendees <= 100;
            case "large-group": return venueAttendees >= 101 && venueAttendees <= 200;
            case "larger-group": return venueAttendees > 200;
            default: return true; // any size
        }
    };
</script>

<template>
    <div class="landing">
        <div class="d-flex flex-column justify-content-center align-items-center custom-searchbar-container-height">
            <h1 class="text-light fw-bold text-center main-text mb-5">Find The Best Place</h1>

            <!-- search bar -->
            <div class="w-75 pb-5">
                <form 
                    class="border border-2 rounded-pill d-flex justify-content-center custom-form-border-color bg-light"
                    @submit.prevent="search"
                >
                    <div class="d-flex align-items-center w-100 p-2 custom-input">
                        <input 
                            type="text"
                            class="ps-3 font-size-18 bg-light"
                            placeholder="Where"
                            v-model="searchQuery.location"
                        >
                        <img 
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='30' height='30' fill='%23FF4081'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 4.71 5.92 10.87 6.2 11.2.42.46 1.18.46 1.6 0C13.08 19.87 19 13.71 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E"
                            alt="pinpoint icon"
                        >
                    </div>
                    <div class="d-flex align-items-center w-100 p-2 custom-input">
                        <VueDatePicker
                            v-model="searchQuery.date"
                            placeholder="Start Date"
                            :start-date="new Date()"
                            :enable-time-picker="false"
                            hide-input-icon
                        />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#FF4081" stroke-width="2" fill="none"/>
                            <line x1="3" y1="10" x2="21" y2="10" stroke="#FF4081" stroke-width="2"/>
                            <line x1="7" y1="2" x2="7" y2="6" stroke="#FF4081" stroke-width="2"/>
                            <line x1="17" y1="2" x2="17" y2="6" stroke="#FF4081" stroke-width="2"/>
                            <circle cx="7" cy="14" r="1.5" fill="#FF4081"/>
                            <circle cx="12" cy="14" r="1.5" fill="#FF4081"/>
                            <circle cx="17" cy="14" r="1.5" fill="#FF4081"/>
                            <circle cx="7" cy="18" r="1.5" fill="#FF4081"/>
                            <circle cx="12" cy="18" r="1.5" fill="#FF4081"/>
                            <circle cx="17" cy="18" r="1.5" fill="#FF4081"/>
                        </svg>

                    </div>

                    <div class="d-flex align-items-center w-100 p-2 custom-input">
                        <select
                            class="form-select font-size-18 bg-light"
                            aria-label="Group size"
                            v-model="searchQuery.attendees"
                        >
                            <option value="" disabled>Group size</option>
                            <option value="any">Any</option>
                            <option value="small-group">1 - 40 attendees</option>
                            <option value="medium-group">41 - 100 attendees</option>
                            <option value="large-group">101 - 200 attendees</option>
                            <option value="larger-group">200+ attendees</option>
                        </select>
                    </div>
                    <button type="submit" class="custom-submit">Search</button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="main-container">
        <div class="row" v-if="venueList.length > 0">
            <div
                v-for="(venue, index) in venueList" 
                :key="index + '_' + venue.venue_name" 
                class="col-12 col-sm-2 col-md-6 col-lg-4 mb-4"
            >
                <VenueCard :venue="venue" :host="venue.host_id" />
            </div>
        </div>
        <div v-else>
            <div class="text-center p-5 m-5">
                <h4>No venues found that match your search criteria.</h4>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .landing {
        background-image: url('/images/auditorium-landing.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        height: 75vh;
    }

    .custom-searchbar-container-height {
        height: 100%;
    }

    .main-text {
        font-size: 72px;
    }

    .custom-form-border-color {
        color: var(--secondary);
    }

    .font-size-18 {
        font-size: 18px;
    }

    ::v-deep(.dp__input) {
        background-color: transparent;
        border: none;
        color: var(--secondary);
        font-size: 18px;
    }

    ::v-deep(.dp__input)::placeholder {
        color: #4a4a4a;
    }

    .custom-input {
        border: 2px solid transparent;
    }

    .custom-input input {
        border: 0;
        width: 100%;
        color: var(--secondary);
    }

    .custom-input input:focus {
        outline: none;
        box-shadow: none;
        border: 0;
    }

    .custom-input select {
        border: 0;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FF4081'%3E%3Cpath d='M1.5 5.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px;
        padding-right: 30px;
        cursor: pointer;
        color: var(--secondary);
    }

    .custom-input select:focus {
        outline: none;
        box-shadow: none;
        border: 0;
    }

    input[type="date"]::-webkit-calendar-picker-indicator  {
        filter: brightness(0) saturate(100%) invert(61%) sepia(90%) saturate(5534%) hue-rotate(316deg) brightness(101%) contrast(101%);
        font-size: 20px;
        cursor: pointer;
    }

    .custom-input:focus-within {
        outline: none;
        box-shadow: none;
        border: 2px solid var(--accent);
    }

    .custom-input:nth-child(1) {
        border-radius: 27px 33.5px 0 27px;
    }

    .custom-input:nth-child(2) {
        border-radius: 0 33.5px 0 33.5px;
    }

    .custom-input:nth-child(3) {
        border-radius: 0 33.5px 0 33.5px;
    }

    .custom-submit {
        border-radius: 0 33.5px 33.5px 33.5px;
        background-color: var(--highlight);
        padding: 0.75rem 2rem;
        border: none;
        color: white;
        font-size: 20px;
        transition: background-color 0.2s ease-in-out;
    }

    .custom-submit:hover {
        background-color: var(--highlight-dark-50);
    }

    .main-container {
        width: 85%;
        margin: 3rem auto;
        z-index: 0;
    }

    .row {
        margin-right: 0 !important;
    }

    @media (max-width: 768px) {
        .custom-searchbar-container-height {
            width: 100% !important;
        }
    }
</style>