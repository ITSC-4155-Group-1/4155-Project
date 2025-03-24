import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { VueCookieNext } from 'vue-cookie-next';

import router from './router';
const pinia = createPinia()

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

createApp(App)
    .use(router)
    .use(pinia)
    .use(VueCookieNext)
    .use(Vue3Toastify,
        {
            autoClose: 5000
        }
    )
    .component('VueDatePicker', VueDatePicker)
    .mount('#app')