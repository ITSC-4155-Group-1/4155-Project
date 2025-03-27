<script setup>
    import { notifications } from '../../mockdata';
    import { ref } from "vue"

    defineProps({
        notif: Object
    });

    const notifList = ref(notifications);

    function remove(event){
        //Remove notification from display
        const list_item = event.target.parentNode.parentNode;
        list_item.classList.add("d-none");

        //TODO: Add code to remove notif from database
    }
</script>

<template>
    <div class="notifPage">
        <h1>Notifications</h1>
        <ul class="listgroup">
            <li v-for="notif in notifList">
                <div class="d-flex justify-content-between">
                    <p>{{ notif.notification }}</p>
                    <button class="removeButton" @click="remove">x</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .notifPage {
        margin: auto 20% auto 15%;
    }

    h1 {
        color: var(--primary);
        padding-bottom: .5rem;
    }

    li {
        list-style-type: none;
        margin-bottom: 1rem;
    }

    ul {
        padding: 0;
    }

    .removeButton {
        border: none;
    }
    
    p {
        margin-bottom: 0;
    }
</style>