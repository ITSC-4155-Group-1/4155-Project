import { createWebHistory, createRouter } from "vue-router";

import LandingPage from "./components/LandingPage.vue";
import SettingsPage from "./components/SettingsPage.vue";
import VenueDetailsPage from "./components/VenueDetailsPage.vue";
import CreateVenue from "./components/CreateVenue.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import NotifPage from "./components/NotifPage.vue"

const routes = [
    { path: '/', component: LandingPage },
    { path: '/settings', component: SettingsPage },
    { path: '/venues/:id', component: VenueDetailsPage },
    { path: '/venues/new', component: CreateVenue},
    { path: '/cart', component: ShoppingCart },
    { path: '/notifications', component: NotifPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    sessionStorage.setItem('lastRoute', to.fullPath);
    next();
});

// After the router is created, check sessionStorage to retrieve the last route after a page refresh
router.isReady().then(() => {
    const lastRoute = sessionStorage.getItem('lastRoute');
    if (lastRoute) {
        router.push(lastRoute);
    } else {
        router.push('/');
    }
});

export default router;