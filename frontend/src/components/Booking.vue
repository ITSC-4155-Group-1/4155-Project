<script setup>
    import { ref, toRefs } from 'vue';

    const props = defineProps({
        venue: Object,
        booking: Object
    });

    const { venue, booking } = toRefs(props);
</script>

<template>
    <h3>Venue Info:</h3>
    <pre>{{ venue }}</pre>
    <h3>Booking Info:</h3>
    <pre>{{ booking }}</pre>
</template>

<style scoped>

</style>