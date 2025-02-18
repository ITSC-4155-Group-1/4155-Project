<script setup>
    import { ref } from 'vue';

    defineProps({
        venue: Object,
    });

    let isFilled = ref(false);

    const toggleIsFilled = () => {
        isFilled.value = !isFilled.value;
    };
</script>

<template>
    <!-- need to make these clickable with a @click event using vue-router -->
    <div class="card venue-card border-0" style="width: 18rem;">
        <div class="image-container">
            <img :src="venue.image[0]" class="card-img-top" alt="Image of venue">
        </div>

        <div class="my-3 d-flex flex-column gap-2">
            <h5 class="card-title">{{ venue.location }}</h5>
            <p class="card-text">6 Miles Away</p> 
            <!-- Hardcoded distance, will replace with Google API -->

            <div class="d-flex justify-content-between">
                <p class="card-text">${{ venue.price }} per day</p>

                <!-- need to add an @click event here as well so that users can favorite the venue -->
                <span>
                    <svg
                        @click="toggleIsFilled()"
                        :fill="isFilled ? '#FF4081' : 'none'"
                        stroke="#FF4081"
                        stroke-width="2"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style="cursor: pointer;"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .image-container {
        width: 100%;
        height: 200px; /* Adjust height as needed */
        overflow: hidden;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures the image covers the entire space without distortion */
    }
</style>