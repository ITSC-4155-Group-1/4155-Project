import { createWebHistory, createRouter } from "vue-router";
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
import { useVenueStore } from "./store/venueStore";
import { createPinia } from 'pinia'
import { parseUser } from "./utils/userUtils.js";
import { showErrorToast } from "./utils/toast";

//import { useCookies } from 'vue-cookie-next';
//const { cookies } = useCookies();
const user = parseUser();
const pinia = createPinia();
const venueStore = useVenueStore(pinia);

const routes = [
    { 
        path: '/',
        name: 'home',
        component: LandingPage
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage,
        meta: {
            requiresAuth: true }
    },
    {
        path: '/venues/:id',
        name: 'venue-details',
        component: VenueDetailsPage,
        beforeEnter(to) {
            const id = to.params.id; // objectId of the venue
            const exists = venueStore.allVenues.some((venue) => {
                return venue._id === id
            })
            if (!exists) {
                return { path: '/venue-not-found' }
            }
        }
    },
    {
        path: '/venues/new',
        name: 'venue-new',
        component: CreateVenue,
        meta: {
            requiresAuth: true }
    },
    {
        path: '/cart',
        name: 'cart',
        component: ShoppingCart,
        meta: {
            requiresAuth: true }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: NotifPage,
        meta: {
            requiresAuth: true }
    },
    {
        path: '/messages',
        name: 'messages',
        component: Messages,
        meta: {
            requiresAuth: true }
    },
    {
        path: '/edit-venue/:id',
        name: 'edit-venue',
        component: EditVenue,
        beforeEnter(to) {
            const id = to.params.id; // objectId of the venue
            const exists = venueStore.allVenues.some((venue) => venue._id === id)
            if (!exists) {
                return { path: '/venue-not-found' }
            }
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/review',
        name: 'review-venue',
        component: LeaveRating,
        meta: {
            requiresAuth: true }
    }, // TODO: path will be '/review:/id later, and will need to add the error handling for this as well, will pretty much be copy and paste
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

router.beforeEach(async (to, from, next) => {
    //const isAuthenticated = cookies.get('authToken'); // Check if user is authenticated
    //console.log(user);
    if (to.meta.requiresAuth && !user) {
        // Show toast message and redirect to login modal
        // localStorage.setItem('showToast', JSON.stringify({ message: 'You must be logged in to access this page.', type: 'error' }));
        showErrorToast("You must be logged in to access the features of this app.")
    } else {
        next(); // Allow navigation if authenticated or not protected
    }
    
    if (venueStore.allVenues.length === 0) {
        await venueStore.fetchAllVenues()
    }
    sessionStorage.setItem('lastRoute', to.fullPath)
    next()
});

router.isReady().then(() => {
    const lastRoute = sessionStorage.getItem('lastRoute');
    if (lastRoute) {
        router.push(lastRoute);
    } else {
        router.push('/');
    }
});

export default router;