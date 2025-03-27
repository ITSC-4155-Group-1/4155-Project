<script setup>
    import { venues } from "../../mockdata";
    import { ref } from "vue"
    import VenueCard from "./VenueCard.vue"

    const venueList = ref(venues);
</script>

<template>
        <div class="landing">
            <div class="d-flex flex-column justify-content-center align-items-center custom-searchbar-container-height">
                <h1 class="text-light fw-bold text-center main-text mb-5">Find The Best Place</h1>

                <!-- search bar -->
                <div class="w-75 pb-5">
                    <form action="#" class="overflow-hidden border border-2 rounded-pill d-flex justify-content-center custom-form-border-color bg-light">
                        <div class="d-flex align-items-center w-100 p-2 custom-input">
                            <input type="text" class="form-control ps-3 font-size-18 bg-light" placeholder="Where">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='30' height='30' fill='%23FF4081'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 4.71 5.92 10.87 6.2 11.2.42.46 1.18.46 1.6 0C13.08 19.87 19 13.71 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E" alt="pinpoint icon">
                        </div>
                        <div class="input-group d-flex align-items-center w-100 p-2 custom-input">
                            <!-- need to replace this input with a VueDatePicker -->
                            <input type="date" class="form-control font-size-18 bg-light" placeholder="When">
                        </div>

                        <div class="d-flex align-items-center w-100 p-2 custom-input">
                            <select class="form-select font-size-18 bg-light" aria-label="Group size">
                                <option selected disabled>Group size</option>
                                <option value="small-group">1 - 5 attendees</option>
                                <option value="medium-group">6 - 15 attendees</option>
                                <option value="large-group">16 - 25 attendees</option>
                                <option value="larger-group">26+ attendees</option>
                            </select>
                        </div>
                        <button type="submit" class="custom-submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="main-container">
            <div class="row">
                <div 
                    v-for="(venue, index) in venueList" 
                    :key="index + '_' + venue.venue_name" 
                    class="col-12 col-sm-2 col-md-6 col-lg-4 mb-4"
                >
                    <VenueCard :venue="venue" />
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

    .custom-input {
        border: 2px solid transparent;
    }

    .custom-input input {
        border: 0;
        color: var(--secondary);
    }

    .custom-input input:focus {
        outline: none;
        box-shadow: none;
        border: 0;
    }

    .custom-input select {
        border: 0;
        appearance: none; 
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FF4081'%3E%3Cpath d='M1.5 5.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px;
        padding-right: 30px;
        cursor: pointer;
        color: var(--secondary)
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
        border-radius: 0 0 0 33.5px;
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