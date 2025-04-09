<script setup>
    import { ref } from 'vue';
    import { venues } from '../../../mockdata';
    import { useRouter } from 'vue-router';
    import { showSuccessToast, showErrorToast } from '../utils/toast';

    const venue = ref(venues[0]);
    const review = ref({
        description: '',
        rating: 0,
    });
    const router = useRouter();

    const hoverRating = ref(0);

    const setRating = (star) => {
        review.value.rating = star;
    };

    const setHover = (star) => {
        hoverRating.value = star;
    };

    const submitReview = async () => {
        try {
            await router.push('/');

            console.log(review.value)

            showSuccessToast('Review submitted successfully.');
        } catch (err) {
            showErrorToast('Failed to submit review. Please try again.');
        }
    };
</script>

<template>
    <div class="w-75 mx-auto d-flex flex-column gap-3">
        <h1>Write a Review</h1>
        <div class="d-flex justify-content-center gap-4">
            <div class="w-50">
                <img
                    loading="lazy"
                    :src="venue.image[0]"
                    alt="main image of venue"
                    class="image-height w-100 object-fit-cover object-position-center rounded"
                />
            </div>
            <div class="w-50">
                <h2>{{ venue.venue_name }}</h2>
                <p class="fw-medium">{{ venue.location }}</p>
                <p>{{ venue.venue_description }}</p>
                <p class="fw-medium">Hosted by: {{ venue.host_id }}</p>
                <p>
                    <span class="fw-medium">Booking Start Date: </span>
                    March 16th, 2025
                </p>
                <p>
                    <span class="fw-medium">Booking End Date: </span>
                    March 16th, 2025
                </p>
            </div>
        </div>

        <div class="w-75 d-flex flex-column gap-2">
            <div class="d-flex gap-1 mb-1 align-items-center">
                <p class="fs-5 p-0 my-0 me-2">Rating:</p>
                <div>
                    <span
                        v-for="star in 5"
                        :key="star"
                        role="button"
                        class="me-1"
                        @click="setRating(star)"
                        @mouseover="setHover(star)"
                        @mouseleave="setHover(0)"
                    >
                        <svg width="35" height="35" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <polygon
                            points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                            :fill="star <= hoverRating || star <= review.rating ? '#FFC107' : 'none'"
                            stroke="#FFC107"
                            stroke-width="1"
                        />
                        </svg>
                    </span>
                </div>
            </div>

            <div>
                <p class="fs-5 p-0 my-0 me-2">Description:</p>
                <textarea
                    v-model="review.description"
                    placeholder="Write a review..."
                    class="p-2 w-100"
                    rows="10"
                ></textarea>
            </div>

            <div class="d-flex gap-2">
                <button
                    type="submit"
                    class="btn custom-btn confirm mb-2"
                    @click="submitReview"
                >
                    Review
                </button>
                <button
                    type="button"
                    class="btn custom-btn cancel mb-2"
                    @click="$router.push('/')"
                >
                    No Thanks
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .image-height {
        height: 350px;
    }

    h2 {
        color: var(--primary);
    }

    span {
        transition: color 0.3s ease;
    }

    textarea {
        outline: none;
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
