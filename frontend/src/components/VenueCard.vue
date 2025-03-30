<script setup>
    import { ref, computed, toRefs, nextTick } from 'vue';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import { useRouter, useRoute } from 'vue-router'
    import 'vue3-carousel/carousel.css'
    import { showSuccessToast, showWarningToast } from '../utils/toast';
    import { parseUser } from '../utils/userUtils'

    const props = defineProps({
        venue: Object,
    });

    const { venue } = toRefs(props)
    const isFilled = ref(false);
    const images = computed(() => venue.value.images ?? []);
    const venueLocation = computed(
        () => venue.value.state && venue.value.city ? `${venue.value.city}, ${venue.value.state}` : venue.value.location
    );
    const router = useRouter();
    const route = useRoute();
    const user = parseUser();
    const isHost = computed(() => venue.value.host === user?.id);
    const isSettingsPage = computed(() => route.path === '/settings');

    const toggleIsFilled = () => {
        // TODO: will make a backend call to favorite it
        // if successful, favorite it and display success toast, else display error toast
        isFilled.value = !isFilled.value;
        if (isFilled.value) {
            showSuccessToast('Successfully favorited this venue.');
        } else {
            showSuccessToast('Successfully unfavorited this venue.');
        }
    };

    const goToVenue = (event) => {
        event.stopPropagation();
        router.push(`/venues/${venue.value.venueName}`)
    };

    const goToEditVenue = async (event) => {
        event.stopPropagation();
        localStorage.setItem('venueDetails', JSON.stringify(venue.value));
        await router.push(`/edit-venue/${venue.value.venueName}`);

        nextTick(() => {
            showWarningToast('Make sure to re-upload your images.', {
                autoClose: 15000
            });
        });
    }

    const carouselConfig = {
        height: 225,
        itemsToShow: 1,
        wrapAround: true,
    }
</script>

<template>
    <div class="card border-0 background hover-effect p-2">
        <div class="image-container position-relative">
            <span class="position-absolute top-0 start-0 rating p-2"> <!-- rating badge -->
                <span> <!-- star icon -->
                    <svg width="23" height="23" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                        fill="none" stroke="#FFC107" stroke-width="1"/>
                    </svg>
                </span>
                {{ venue.rating }} / 5.0 
            </span>
            <Carousel v-bind="carouselConfig">
                <Slide v-for="image in images" :key="image">
                    <img
                        :src="image"
                        class="card-img-top"
                        alt="Venue Images"
                        loading="lazy"
                        @click="goToVenue"
                    >
                </Slide>
                
                <template #addons>
                    <Navigation class="mx-1" @stop.click />
                </template>
            </Carousel>
            <span class="badge position-absolute bottom-0 end-0 m-2 capacity">{{ venue.capacity }} people </span>
        </div>
        <router-link :to="`/venues/${venue.venueName}`" class="text-decoration-none">
            <div class="mt-3 d-flex flex-column">
                <h5 class="card-title">{{ venueLocation }}</h5>
                <p class="card-text">6 Miles Away</p>  <!-- Hardcoded distance, will replace with Google API -->
                <div class="d-flex justify-content-between">
                    <p class="card-text">${{ venue.price }} per day</p>
                </div>
            </div>
        </router-link>
        <span class="heart-icon position-absolute bottom-0 end-0 m-3" v-if="!isHost">
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
        <span
            class="heart-icon position-absolute bottom-0 end-0 m-3"
            v-else-if="isHost && isSettingsPage"
            @click="goToEditVenue"
        >
            ✏️
        </span>
    </div>
</template>

<style scoped>
    .hover-effect {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    .hover-effect:hover {
        transform: scale(1.03);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
    }

    .carousel {
        --vc-nav-background: rgba(255, 255, 255, 0.7);
        --vc-nav-border-radius: 100%;
    }

    .image-container {
        width: 100%;
        height: 225px;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .capacity {
        font-size: 14px;
        background-color: var(--primary);
        z-index: 10;
    }
    
    .rating {
        font-size: 14px;
        background-color: var(--secondary-opacity-50);
        color: var(--highlight);
        font-size: 16px;
        font-weight: bolder;
        border-radius: 5px 0 0.5rem 0;
        z-index: 10;
    }

    .background {
        background-color: var(--background);
    }

    .card-title {
        color: var(--primary) !important;
    }
    
    .card-text {
        color: var(--secondary) !important;
    }

    .heart-icon {
        transform: translateY(7px);
    }
</style>
