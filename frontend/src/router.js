import { createWebHistory, createRouter } from "vue-router";
import { venues } from "../../mockdata";

import LandingPage from "./components/LandingPage.vue";
import SettingsPage from "./components/SettingsPage.vue";
import VenueDetailsPage from "./components/VenueDetailsPage.vue";
import CreateVenue from "./components/CreateVenue.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import NotifPage from "./components/NotifPage.vue"
import Messages from "./components/Messages.vue";
import EditVenue from "./components/EditVenue.vue";
import ErrorPage from "./components/ErrorPage.vue";
import LeaveRating from "./components/LeaveRating.vue";

const routes = [
    { 
        path: '/',
        name: 'home',
        component: LandingPage
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage
    },
    {
        path: '/venues/:id',
        name: 'venue-details',
        component: VenueDetailsPage,
        beforeEnter(to) {
            const id = to.params.id; // name of the venue
            const exists = venues.some(venue => venue.venue_name === id);
            if (!exists) {
                return { path: '/venue-not-found' }
            }
        }
    },
    {
        path: '/venues/new',
        name: 'venue-new',
        component: CreateVenue
    },
    {
        path: '/cart',
        name: 'cart',
        component: ShoppingCart
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: NotifPage
    },
    {
        path: '/messages',
        name: 'messages',
        component: Messages
    },
    {
        path: '/edit-venue/:id',
        name: 'edit-venue',
        component: EditVenue,
        beforeEnter(to) {
            const id = to.params.id; // name of the venue
            const exists = venues.some(venue => venue.venue_name === id);
            if (!exists) {
                return { path: '/venue-not-found' }
            }
        }
    },
    {
        path: '/review',
        name: 'review-venue',
        component: LeaveRating
    }, // path will be '/review:/id later, and will need to add the error handling for this as well, will pretty much be copy and paste
    {
        path: '/:pathMatch(.*)*',
        name: 'error-page',
        component: ErrorPage
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
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