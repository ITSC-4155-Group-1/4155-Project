import { createMemoryHistory, createRouter } from "vue-router";

import LandingPage from "./components/LandingPage.vue";
import SettingsPage from "./components/SettingsPage.vue";

const routes = [
    { path: '/', component: LandingPage },
    { path: '/settings', component: SettingsPage },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;