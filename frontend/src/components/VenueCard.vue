<script setup>
    import { ref, computed, toRefs, nextTick } from 'vue';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import { useRouter, useRoute } from 'vue-router'
    import 'vue3-carousel/carousel.css'
    import { showSuccessToast, showWarningToast } from '../utils/toast';
    import { parseUser } from '../utils/userUtils'
    import { useVenueStore } from '../store/venueStore';

    const props = defineProps({
        venue: Object,
    });

    const { venue } = toRefs(props)
    const isFilled = ref(false);
    const images = computed(() => venue.value.images ?? []); // broken at the moment because the images are not present in the images folder since i had to create mock images and directly inserted them in the database
    const venueLocation = computed(
        () => venue.value.state && venue.value.city ? `${venue.value.city}, ${venue.value.state}` : venue.value.location
    );
    const router = useRouter();
    const route = useRoute();
    const user = parseUser();
    const venueStore = useVenueStore();
    const deleteVenueModal = ref(false);
    
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

    const toggleDeleteVenueModal = () => {
        deleteVenueModal.value = !deleteVenueModal.value;
    }

    const deleteVenue = async () => {
        const id = venue.value._id;
        const success = await venueStore.deleteVenue(id);
        if (success) {
            await router.push('/');
            nextTick(() => {
                showSuccessToast('Venue deleted successfully.');
            })
        } else {
            return;
        }
    }

    // // TODO: since no venue has any reviews, i'm going to statically make it whatever it is at the moment
    // const venueRating = computed(() => {
    //     const totalReviews = venueReviews.value.length;
    //     const totalStars = venueReviews.value.reduce((acc, review) => acc + review.rating, 0);

    //     return totalReviews > 0 ? totalStars / totalReviews : 0;
    // })

    const goToVenue = (event) => {
        event.stopPropagation();
        router.push(`/venues/${venue.value._id}`)
    };

    const goToEditVenue = async (event) => {
        event.stopPropagation();
        await router.push(`/edit-venue/${venue.value._id}`);

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
            <span class="position-absolute top-0 start-0 rating p-2" v-if="venue.rating"> <!-- rating badge --> <!-- TODO: this condition is also gonna change -->
                <span> <!-- star icon -->
                    <svg width="23" height="23" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                        fill="none" stroke="#FFC107" stroke-width="1"/>
                    </svg>
                </span>
                {{ venue.rating }} / 5.0 <!-- TODO: need to calculate the average, the average comes from the review stars -->
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
        <router-link :to="`/venues/${venue._id}`" class="text-decoration-none">
            <div class="mt-3 d-flex flex-column">
                <h5 class="card-title">{{ venueLocation }}</h5>
                <p class="card-text">Unknown Miles Away</p>  <!-- Hardcoded distance, will replace with Google API -->
                <div class="d-flex justify-content-between">
                    <p class="card-text">${{ venue.price }} per day</p>
                </div>
            </div>
        </router-link>
        <span class="icons position-absolute bottom-0 end-0 m-3" v-if="!isHost">
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
            class="action-icons position-absolute bottom-0 end-0 m-3"
            v-else-if="isHost && isSettingsPage"
            @click="toggleDeleteVenueModal"
        >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7H19" stroke="red" stroke-width="2"/>
                <path d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7" stroke="red" stroke-width="2"/>
                <rect x="6" y="7" width="12" height="14" stroke="red" stroke-width="2" fill="none"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="red" stroke-width="2"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="red" stroke-width="2"/>
            </svg>
        </span>
        <span 
            class="action-icons position-absolute bottom-0 m-3 move-left"
            @click="goToEditVenue"
            v-if="isHost && isSettingsPage"
        >
            ✏️
        </span>
    </div>

    <div v-if="deleteVenueModal" class="overlay">
        <div class="popup bg-light">
            <button class="close-btn" @click="toggleDeleteVenueModal">
                &times;
            </button>

            <div>
                <h3>Do you wish to continue?</h3>
                <div class="d-flex gap-2">
                    <button
                        type="submit"
                        class="btn w-50 mt-3 custom-btn confirm"
                        @click="deleteVenue"
                    >
                        Delete Venue
                    </button>
                    <button
                        type="submit"
                        class="btn w-50 mt-3 custom-btn cancel"
                        @click="toggleDeleteVenueModal"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
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

    .action-icons {
        transform: translateY(7px);
    }

    .move-left {
        right: 2.5rem;
    }

    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
    }

    .popup {
        position: relative;
        width: 50%;
        background: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
    }

    .close-btn {
        position: absolute;
        top: 5px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2em;
        cursor: pointer;
        color: #333;
    }
    
    .custom-btn {
        width: fit-content;
        padding: 0.75rem 2rem;
        color: white;
        transition: background-color 0.2s ease-in-out;
    }

    .confirm {
        color: white;
        background-color: var(--highlight);
    }
    
    .confirm:hover {
        color: white;
        background-color: var(--highlight-dark-50);
    }

    .cancel {
        color: white;
        background-color: red;
    }

    .cancel:hover {
        color: white;
        background-color: darkred;
    }
</style>
