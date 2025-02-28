import { createMemoryHistory, createRouter } from "vue-router";

import LandingPage from "./components/LandingPage.vue";
import SettingsPage from "./components/SettingsPage.vue";
import CreateVenue from "./components/CreateVenue.vue";

const routes = [
    { path: '/', component: LandingPage },
    { path: '/settings', component: SettingsPage },
    { path: '/venues/new', component: CreateVenue}
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;