import { createMemoryHistory, createRouter } from "vue-router";

import LandingPage from "./components/LandingPage.vue";
import SettingsPage from "./components/SettingsPage.vue";
import VenueDetailsPage from "./components/VenueDetailsPage.vue";

const routes = [
    { path: '/', component: LandingPage },
    { path: '/settings', component: SettingsPage },
    { path: '/venues/:id', component: VenueDetailsPage },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;