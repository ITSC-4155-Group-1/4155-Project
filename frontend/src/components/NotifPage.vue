<script setup>
    import { notifications } from '../../../mockdata';
    import { ref } from "vue"
    import { parseUser } from '../utils/userUtils'

    const user = parseUser();
    const notifList = ref(null);
    notifList.value = notifications.filter(notification => {
        return notification.read === false && notification.for === user?.firstName;
    });

    const remove = (index) => {
    notifList.value[index].isFading = true;
    notifList.value[index].read = true;

    setTimeout(() => {
        notifList.value.splice(index, 1);
    }, 500);
    
    // TODO: Add code to remove notif from database
};
</script>

<template>
    <div class="notifContainer mx-auto">
        <h1 class="pb-2">Notifications</h1>
        <ul class="list-group list-unstyled" v-if="notifList.length > 0">
            <li
                v-for="(notif, idx) in notifList"
                :key="idx"
                class="mb-4 hover-effect py-3 px-1 rounded m-0"
                :class="{ 'fade-out': notif.isFading }"
                role="button"
            >
                <div class="d-flex justify-content-between">
                    <p class="m-0">{{ notif.notification }}</p>
                    <button class="border-0 bg-transparent me-3" @click="remove(idx)">&#10005;</button>
                </div>
            </li>
        </ul>
        <div v-else class="text-center">No unread notifications</div>
    </div>
</template>

<style scoped>
    .notifContainer {
        width: 80%;
    }

    h1 {
        color: var(--primary);
    }

    .hover-effect {
        transition: 0.3s ease-in-out;
    }

    .hover-effect:hover {
        background-color: rgba(0, 0, 0, 0.05);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        scale: 1.01;
    }

    .fade-out {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
</style>