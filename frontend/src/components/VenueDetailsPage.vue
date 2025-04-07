<script setup>
    import { ref, computed, onMounted, watch, nextTick } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useCartStore } from '../store/cartStore';
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import 'vue3-carousel/carousel.css'
    import { showSuccessToast, showWarningToast } from '../utils/toast.js';
    import { parseUser } from '../utils/userUtils.js'
    import { useVenueStore } from '../store/venueStore';
    import he from 'he';

    const router = useRouter();
    const cartStore = useCartStore();
    const user = parseUser();
    const venueStore = useVenueStore();

    const route = useRoute();
    const venue = ref({});
    const venueReviews = ref([]);
    const dateRange = ref(null);
    const attendees = ref('');
    const cleaningFee = 200;
    const processing = 50;
    const total = ref(0);
    const isFilled = ref(false);
    const activeIndex = ref(0); // accordion active index
    const showMoreImages = ref(false);
    const minDate = ref(null);
    const maxDate = ref(null);
    const disabledDates = ref([]);
    const hostFirstName = ref('');
    const hostId = ref(null);
    const deleteVenueModal = ref(false);

    onMounted(async () => {
        const venueId = route.params.id;
        const [venueData, host] = await venueStore.getVenueById(venueId);
        
        if (venueData) {
            venue.value = venueData;
            // venueReviews.value = venueData.reviews; venues don't have reviews yet
        }

        if (host) {
            hostFirstName.value = host.firstName;
            hostId.value = host._id;
        }

        // getting the bookings for the venues as well
        const bookings = await venueStore.getBookingsForVenueById(venueId);
        if (bookings && bookings.length > 0) {
            let blockedDates = []
            bookings.forEach((booking) => {
                const startDate = new Date(booking.bookingStartDate);
                const endDate = new Date(booking.bookingEndDate);

                // all the dates between as well
                const dateArray = [];
                for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                    dateArray.push(new Date(d));
                }
                blockedDates.push(...dateArray);
            });
            disabledDates.value = [...blockedDates];
        }
    })

    onMounted(() => {
        const cartDetails = JSON.parse(localStorage.getItem('cartDetails'));
        if (cartDetails) {
            if (cartDetails.startDate && cartDetails.endDate) {
                dateRange.value = [new Date(cartDetails.startDate), new Date(cartDetails.endDate)];
            }
            if (cartDetails.attendees) {
                attendees.value = cartDetails.attendees;
            }
        }
    });

    // // TODO: will make a call to the backend to save the venue for the user
    const saveVenue = () => {
        isFilled.value = !isFilled.value;
        if (isFilled.value) {
            showSuccessToast(
                'Successfully favorited this venue.',
                'successId',
            );
        } else {
            showSuccessToast('Successfully unfavorited this venue.');
        }
    };

    watch(() => venue.value.availability, (newAvailability) => {
        if (newAvailability && newAvailability.length > 0) {
            const offsetStartDate = new Date(venue.value.availability[0])
            const venueStartDate = new Date(offsetStartDate);
            venueStartDate.setDate(offsetStartDate.getDate() + 1);
            
            const today = new Date();

            if (venueStartDate > today) {
                minDate.value = venueStartDate;
            } else {
                minDate.value = today;
            }
        }
        maxDate.value = new Date(venue.value.availability[1]);
    });

    watch(() => venue.value.venueName, () => {
        const newTitle = he.decode(venue.value.venueName);
        venue.value.venueName = newTitle;
    })

    const usAbbreviations = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }

    const usStateToAbbreviation = (state) => {
        for (let key in usAbbreviations) {
            if (usAbbreviations[key] === state) {
                return key;
            }
        }
        return state;
    }

    const collapsibleSections = ref([
        { title: "Parking", content: "Ample parking space is available on-site. Parking is free for the first 2 hours, after which a small fee is applied." },
        { title: "Host Rules", content: "Hosts must ensure that guests follow safety protocols. No loud music after 10 PM. Alcohol consumption is allowed in designated areas only." },
        { title: "Cancellation Policy", content: "Cancellations made 14 days prior to the event date will receive a full refund. After that, a 50% refund will be issued if cancelled within 7 days." },
        { title: "Operational Hours", content: "The venue operates from 9 AM to 11 PM daily. Special hours may apply for holidays or special events." },
    ]);

    watch(() => venue.value.address, () => {
        const newAddress = {
            title: "Location",
            content: `${he.decode(venue.value.address)}, ${he.decode(venue.value.city)}, ${usStateToAbbreviation(he.decode(venue.value.state))}`
        };
        collapsibleSections.value.push(newAddress);
    })

    // // TODO: since no venue has any reviews, i'm going to statically make it whatever it is at the moment
    // const venueRating = computed(() => {
    //     const totalReviews = venueReviews.value.length;
    //     const totalStars = venueReviews.value.reduce((acc, review) => acc + review.rating, 0);

    //     return totalReviews > 0 ? totalStars / totalReviews : 0;
    // })

    const submitBooking = () => {
        if (!dateRange.value || dateRange.value.length !== 2  || !attendees.value) {
            alert("Please fill out all required fields.");
            return;
        } 
        // also going to store the details in local storage to ensure that when the user refreshes the cart page, the details don't disappear
        localStorage.setItem('cartDetails', JSON.stringify({
            id: venue.value._id,
            host: venue.value.host,
            venueName: venue.value.venueName,
            price: venue.value.price,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
            attendees: attendees.value,
            cleaningFee: cleaningFee,
            processing: processing,
            images: venue.value.images.length > 1 ? venue.value.images.join(',') : venue.value.images,
            capacity: venue.value.capacity,
            disabledDateRanges: disabledDates.value,
            minDate: minDate.value,
            maxDate: maxDate.value,
            host: hostFirstName.value,
        }));

        cartStore.setCartDetails({
            id: venue.value._id,
            host: venue.value.host,
            venueName: venue.value.venueName,
            price: venue.value.price,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
            attendees: attendees.value,
            cleaningFee: cleaningFee,
            processing: processing,
            images: venue.value.images.length > 1 ? venue.value.images.join(',') : venue.value.images,
            capacity: venue.value.capacity,
            disabledDateRanges: disabledDates.value, 
            minDate: minDate.value,
            maxDate: maxDate.value,
            host: hostFirstName.value,
        });

        router.push('/cart')
    };

    const goToEditVenue = async (event) => {
        event.stopPropagation();
        // localStorage.setItem('venueDetails', JSON.stringify(venue.value));
        await router.push(`/edit-venue/${venue.value._id}`);

        nextTick(() => {
            showWarningToast('Make sure to re-upload your images.', {
                autoClose: 15000
            });
        });
    }

    const deleteVenue = async () => {
        const id = route.params.id;
        const success = await venueStore.deleteVenue(id);
        if (success) {
            deleteVenueModal.value = false;
            await router.push('/');
            nextTick(() => {
                showSuccessToast('Venue deleted successfully.');
            })
        } else {
            return;
        }
    }

    const toggleDeleteVenueModal = () => {
        deleteVenueModal.value = !deleteVenueModal.value;
    }

    const calculateDays = computed(() => {
        if (dateRange.value && dateRange.value.length === 2) {
            const start = new Date(dateRange.value[0]);
            const end = new Date(dateRange.value[1]);
            const diffTime = end - start;
            return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
        return 0;
    });

    const totalPrice = computed(() => {
        if (!venue.value || !venue.value.price || calculateDays.value === 0) {
            return 0;
        }

        total.value = (venue.value.price * calculateDays.value) + cleaningFee + processing;
        return parseFloat(total.value).toFixed(2);
    });

    const isFormValid = computed(() => {
        return dateRange.value && dateRange.value.length === 2 && attendees.value;
    });
    
    const validAttendeeOptions = computed(() => {
        const capacity = venue.value.capacity;
        const options = [
            { label: '1-40', value: '1-40' },
            { label: '41-100', value: '41-100' },
            { label: '101-199', value: '101-199' },
            { label: '200+', value: '200+' }
        ];

        const validOptions = [];

        options.forEach(option => {
            const [min, max] = option.value.split('-').map(Number);

            if (option.value === '200+') {
                if (capacity >= 200) {
                    validOptions.push(option);
                }
            } else if (capacity >= min && capacity <= max) {
                validOptions.push(option);
            } else if (capacity > min) {
                validOptions.push(option);
            }
        });

        return validOptions;
    });

    const toggleAccordion = (index) => {
        activeIndex.value = activeIndex.value === index ? null : index;
    };

    const toggleShowMoreImages = () => {
        showMoreImages.value = !showMoreImages.value;
        document.body.style.overflow = showMoreImages.value ? 'hidden' : 'auto';
    };

    const carouselConfig = {
        height: 700,
        itemsToShow: 1,
        wrapAround: true,
    }
</script>

<template>
    <div class="w-95 mx-auto">
        <div class="w-100 d-flex justify-content-between align-items-center">
            <div class="venue-name-location mb-1">
                <span class="fs-2 venue-name">
                    {{ venue.venueName }} 
                    <span class="fs-5">(Hosted by {{ user?.id === hostId ? 'You' : hostFirstName }})</span>
                </span>
                <span class="venue-location">{{ venue.city }}, {{ venue.state }}</span>
            </div>
            <div class="share-save-container d-flex gap-3">
                <span
                    class="fw-bold d-flex justify-content-center align-items-center gap-1 share-save-icons">
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        height="26"
                        width="26"
                        viewBox="0 0 832 800"
                        enable-background="new 0 0 832 800"
                        xml:space="preserve"
                    >
                        <path fill="blue" opacity="1.000000" stroke="blue"  
                            d="
                                M105.673889,643.629456 C88.682732,673.163391 77.298012,704.547913 68.209618,736.871643 C64.831245,748.887146 61.077244,760.796936 57.499119,772.756287 C57.077858,774.164368 56.984028,775.748352 55.417328,776.509766 C53.701511,776.167358 53.625351,774.639099 53.275051,773.432556 C46.128590,748.816589 38.469383,724.331909 32.062725,699.523987 C26.236891,676.965210 22.815292,653.940857 21.457174,630.576050 C20.313942,610.908020 19.932520,591.223267 21.244390,571.651489 C22.767918,548.921997 26.605001,526.402039 32.204254,504.247528 C42.982819,461.600037 59.854065,421.558136 83.670753,384.536865 C116.091026,334.141968 157.639862,292.953888 208.685425,261.473145 C240.229889,242.019058 273.984100,227.671829 309.798920,218.130463 C348.425385,207.840042 387.774902,204.687347 427.589813,205.961792 C429.753693,206.031052 431.920898,206.013962 434.086487,206.008652 C436.559937,206.002594 437.724213,204.741745 437.674561,202.268570 C437.637787,200.436615 437.698883,198.602905 437.699280,196.769974 C437.707367,157.941971 437.675415,119.113907 437.752533,80.286057 C437.767151,72.930244 438.720123,65.674934 441.927277,58.902405 C448.983521,44.001755 465.379852,37.192291 480.962952,42.666050 C486.844208,44.731918 492.176575,47.788670 497.021271,51.663383 C538.263000,84.647842 579.464783,117.682274 620.714172,150.657196 C680.440857,198.403046 740.153625,246.166595 799.975037,293.793549 C813.221191,304.339569 821.619263,317.069885 821.359558,334.596130 C821.132324,349.931946 814.056030,361.806763 802.519775,371.065369 C755.882751,408.494507 709.068604,445.702911 662.358276,483.040924 C617.601562,518.817383 572.900513,554.663513 528.156860,590.456299 C517.101379,599.300171 506.115417,608.240540 494.837433,616.793640 C485.826233,623.627686 475.771820,627.892822 464.104218,625.549805 C450.305939,622.778931 442.526825,613.687561 439.253357,600.504333 C438.099121,595.855957 437.649139,591.019714 437.658600,586.145386 C437.729736,549.317261 437.705383,512.488892 437.687286,475.660645 C437.683502,467.969055 437.067291,467.410461 429.491180,467.282135 C406.665558,466.895538 383.811615,466.520264 361.128815,469.496521 C335.475067,472.862610 310.453735,479.021667 286.191406,488.141174 C236.045776,506.989563 192.682114,536.048462 155.959122,574.961975 C136.442871,595.642456 119.840271,618.537170 105.673889,643.629456 M691.375488,255.154510 C680.952332,246.852646 670.518494,238.564056 660.107788,230.246628 C607.525635,188.237289 554.950317,146.219315 502.370056,104.207603 C495.210876,98.487434 488.090576,92.716553 480.847717,87.104080 C477.228394,84.299492 475.708649,84.933464 475.374420,89.069771 C475.253967,90.560555 475.326019,92.067642 475.325958,93.567291 C475.324310,141.724823 475.325012,189.882355 475.324249,238.039886 C475.324127,245.419418 475.312561,245.608002 467.853333,245.250305 C442.730286,244.045517 417.597443,243.492081 392.451080,243.985657 C363.130676,244.561157 334.494843,249.652542 306.551514,258.290192 C258.939850,273.007660 216.399612,296.889282 179.184113,330.131378 C138.907333,366.107880 108.224274,408.971710 87.124580,458.660339 C73.578308,490.561096 64.838570,523.708862 60.799587,558.200073 C57.802399,583.794739 57.455437,609.341553 59.446960,634.965149 C59.681324,637.980591 59.518009,641.227844 61.163952,644.091492 C63.727268,643.466980 64.106537,641.270142 65.011292,639.608459 C67.240105,635.514832 69.207069,631.276367 71.492973,627.216431 C99.773216,576.988464 136.756470,534.448730 183.642944,500.731140 C250.114044,452.929718 324.416107,429.247070 406.199921,429.182190 C427.009766,429.165680 447.820038,430.209198 468.630890,430.735657 C475.301697,430.904449 475.311340,430.860321 475.312195,437.430573 C475.318146,483.421539 475.307312,529.412537 475.363831,575.403442 C475.366516,577.584351 474.516266,580.094788 476.788330,581.940552 C479.675201,581.534790 481.378784,579.291809 483.398682,577.684814 C502.820923,562.233032 522.174561,546.695068 541.565186,531.203430 C595.181213,488.368500 648.805481,445.543915 702.426575,402.715424 C727.676636,382.547577 753.006409,362.478271 778.129700,342.153809 C785.903809,335.864655 785.550781,330.509521 777.778076,324.287689 C749.166870,301.385284 720.544922,278.496338 691.375488,255.154510 z"
                            />
                    </svg>
                    Share
                </span>
                <span 
                    class="fw-bold d-flex justify-content-center align-items-center gap-1 share-save-icons"
                    @click="saveVenue"
                    v-if="hostId !== user?.id && user"
                >
                    <svg
                        :fill="isFilled ? '#FF4081' : 'none'"
                        stroke="#FF4081"
                        stroke-width="2"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style="cursor: pointer;"
                        >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Save
                </span>
                <span 
                    class="fw-bold d-flex justify-content-center align-items-center gap-1 share-save-icons"
                    @click="goToEditVenue"
                    v-if="hostId === user?.id && user"
                >
                    ✏️ Edit
                </span>
                <span 
                    class="fw-bold d-flex justify-content-center align-items-center gap-1 share-save-icons"
                    @click="toggleDeleteVenueModal"
                    v-if="hostId === user?.id && user"
                >
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7H19" stroke="red" stroke-width="2"/>
                        <path d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7" stroke="red" stroke-width="2"/>
                        <rect x="6" y="7" width="12" height="14" stroke="red" stroke-width="2" fill="none"/>
                        <line x1="10" y1="11" x2="10" y2="17" stroke="red" stroke-width="2"/>
                        <line x1="14" y1="11" x2="14" y2="17" stroke="red" stroke-width="2"/>
                    </svg>
                    Delete
                </span>
            </div>
        </div>

        <div v-if="deleteVenueModal" class="overlay">
            <div class="popup bg-light">
                <button class="close-btn" @click="toggleDeleteVenueModal">
                    &times;
                </button>

                <div>
                    <h3>Do you wish to continue?</h3>
                    <div class="d-flex gap-2">
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn confirm"
                            @click="deleteVenue"
                        >
                            Delete Venue
                        </button>
                        <button
                            type="submit"
                            class="btn w-50 mt-3 custom-btn cancel"
                            @click="toggleDeleteVenueModal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex gap-2 image-gallery"
            v-if="venue.images"
        >
            <div class="w-50">
                <img
                    :src="venue.images[0]" alt="Venue image"
                    class="w-100 h-100 object-fit-cover d-flex align-items-center justify-content-center overflow-hidden rounded"
                >
            </div>
            <div class="w-50 other-images-grid">
                <template v-if="venue.images.length > 1">
                    <div class="grid-item position-relative" v-for="(image, index) in venue.images.slice(1, 5)">
                        <img  
                            :key="index" 
                            :src="image" 
                            alt="Venue image" 
                            class="rounded"
                            :class="{ 'show-more-images-overlay' : index === 3 }"
                        >
                        <div 
                            v-if="index === 3"
                            class="black-overlay position-absolute top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        >
                            <button
                                class="show-more-images-btn border-0 px-1 py-2 rounded bg-transparent text-light"
                                @click="toggleShowMoreImages"
                            >
                                Show More &#8594;
                            </button>
                        </div>
                    </div>
                </template>
                <template v-if="venue.images.length < 5">
                    <div
                        v-for="index in 5 - venue.images.length"
                        :key="'placeholder-' + index"
                        class="placeholder-box d-flex justify-content-center align-items-center rounded w-100 h-100 border-2"
                    ></div>
                </template>
            </div>
        </div>
        <p v-else class="d-flex align-items-center justify-content-center noImageAvailable">No images available</p>

        <div
            v-if="showMoreImages"
            class="show-more-images-container mx-auto position-fixed top-0  w-100 h-100 d-flex justify-content-center align-items-center"
        >
            <button class="close-show-more-images-container" @click="toggleShowMoreImages">&#10005;</button>
            <Carousel v-bind="carouselConfig">
                <Slide v-for="image in venue.images" :key="image">
                    <img
                        :src="image"
                        alt="Venue Images"
                        loading="lazy"
                        class="w-80 h-100 object-fit-cover rounded"
                    >
                </Slide>
                
                <template #addons>
                    <Navigation class="mx-4" />
                </template>
            </Carousel>
        </div>

        <div class="d-flex justify-space-around gap-5">
            <div
                class="w-65 my-2"
                :class="user?.id !== venue.host ? 'smaller-container' : ''"
            >
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div v-if="venueRating">
                        <span class="rating fs-5 fw-bolder d-flex align-items-center gap-1">
                            <svg
                                width="23"
                                height="23"
                                viewBox="0 0 15 15"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                                    fill="#FFC107" stroke="#FFC107" stroke-width="1"/>
                            </svg>
                            {{ venueRating.toFixed(1) }} / 5.0 
                        </span>
                    </div>
                    <div v-else>
                        <span class="fs-5 fw-medium rating">No Reviews</span>
                    </div>

                    <div
                        v-if="venue.capacity"
                    >
                        <span class="fs-5 fw-medium d-flex align-items-center gap-1">
                            <svg
                                width="23"
                                height="23"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000000"
                                stroke-width="3"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="12" cy="7" r="4"/>  <!-- Head -->
                                <path d="M4 21v-2c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v2" /> 
                            </svg>
                            {{ venue.capacity }} max
                        </span>
                    </div>
                </div>
    
                <h5>About the space</h5>
                <p>{{ venue.venue_description }}</p>
                
                <!-- Collapsible Sections -->
                <div class="accordionContainer">
                    <div class="accordion" id="venueAccordion">
                        <div v-for="(section, index) in collapsibleSections" :key="index" class="accordion-item custom-accordion-box">
                            <h2 class="accordion-header" :id="'heading-' + index">
                                <button
                                    class="accordion-button custom-accordion-button"
                                    :class="{ 'collapsed': activeIndex !== index }"
                                    type="button"
                                    @click="toggleAccordion(index)"
                                    :aria-expanded="activeIndex === index"
                                    :aria-controls="'collapse-' + index"
                                >
                                    {{ section.title }}
                                    <span class="ms-auto">
                                        <i :class="activeIndex === index ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                                    </span>
                                </button>
                            </h2>
                            <div
                                :id="'collapse-' + index"
                                class="accordion-collapse collapse"
                                :class="{ 'show': activeIndex === index }"
                                :aria-labelledby="'heading-' + index"
                                data-bs-parent="#venueAccordion"
                            >
                                <div class="accordion-body px-2">
                                    {{ section.content }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="reviews mt-4" v-if="venueReviews.length > 0">
                    <h5 class="mb-3">
                        {{ venueReviews.length > 1 ? 'Reviews' : 'Review' }}
                        ({{ venueReviews.length }})
                    </h5>
                    <div
                        class="review-container" v-for="review in venueReviews"
                        :key="review.comment + '_' + review.user_id"
                    >
                        <div class="d-flex align-items-center mb-2">
                            <div class="d-flex align-items-center justify-content-between w-100">
                                <div class="d-flex gap-3 align-items-center">
                                    <img
                                        src="/images/profile_4.jpeg"
                                        alt="profile pic"
                                        class="rounded-circle object-fit-cover"
                                        width="35"
                                    >
                                    <span class="reviewer">{{ review.user_id }}</span>
                                </div>
                                <div>
                                    <span class="rating fs-5 fw-bolder">
                                        <svg
                                            width="23"
                                            height="23"
                                            viewBox="0 0 15 15"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <polygon points="7,1 8.54,5 13,5 9.23,7.95 10.77,12 7,9.5 3.23,12 4.77,7.95 1,5 5.46,5"
                                                fill="#FFC107" stroke="#FFC107" stroke-width="1"/>
                                        </svg>
                                        {{ review.rating.toFixed(1) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <p class="review-comment">{{ review.comment }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Booking Form Container -->
            <div
                class="w-35 my-2 border border-2 border-dark p-4 rounded booking-modal bg-light"
                v-if="user?.id !== hostId"
            >
                <form @submit.prevent="submitBooking">
                    <div class="mb-4">
                        <label for="dateRange" class="form-label fw-medium fs-5">Select Dates:</label>
                        <VueDatePicker
                            v-model="dateRange"
                            range
                            placeholder="mm/dd/yyyy - mm/dd/yyyy"
                            :start-date="minDate"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :enable-time-picker="false"
                            :disabled-dates="disabledDates"
                            required
                        />
                    </div>
    
                    <div class="mb-4">
                        <label for="attendees" class="form-label fw-medium fs-5">Attendees</label>
                        <select class="form-select attendees-no-box-shadow" id="attendees" v-model="attendees" required>
                            <option selected disabled value="">Choose...</option>
                            <option 
                                v-for="option in validAttendeeOptions" 
                                :key="option.value" 
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                        <div class="invalid-feedback" v-if="!attendees">
                            Please select the number of attendees.
                        </div>
                    </div>

                    <div>
                        <label for="price" class="form-label fw-medium fs-5">Price</label>
                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex justify-content-between">
                                <span
                                    v-if="dateRange && dateRange.length === 2"
                                >
                                    ${{ venue.price }} x {{ calculateDays }} days
                                </span>
                                <span v-else>--</span>

                                <span
                                    v-if="dateRange && dateRange.length === 2"
                                >
                                    ${{ parseFloat(venue.price * calculateDays).toFixed(2) }}
                                </span>
                                <span v-else>--</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Cleaning Fee</span>
                                <span>${{ cleaningFee }}</span>
                            </div>
            
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Processing</span>
                                <span>${{ processing }}</span>
                            </div>
                        </div>
                    </div>

                    <hr class="my-4 border border-1 border-dark">
    
                    <div class="d-flex justify-content-between align-items-center my-3 total">
                        <strong>Total:</strong> 
                        <strong v-if="dateRange && dateRange.length === 2">${{ totalPrice }}</strong>
                        <strong v-else>--</strong>
                    </div>
    
                    <button 
                        class="rounded w-100 py-2"
                        type="submit"
                        :class="{ 'btn-active': isFormValid }"
                        :disabled="!isFormValid"
                    >
                        Start Booking
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .w-95 {
        width: 95%;
    }

    .w-80 {
        width: 80%;
    }

    .w-65 {
        width: 65%;
    }

    .w-35 {
        width: 35%;
    }

    .smaller-container {
        width: 95%;
        margin: 4px 0;
    }

    .image-gallery {
        max-height: 56vh;
        overflow: hidden;
    }

    .noImageAvailable {
        font-size: 20px;
        color: var(--secondary);
        height: 50vh;
    }

    .booking-modal {
        height: fit-content;
        box-shadow: 4px 5px 7px rgba(0, 0, 0, 0.2);
        position: sticky;
        top: 96px;
    }

    .share-save-icons {
        cursor: pointer;
        user-select: none;
    }

    .venue-name-location {
        display: flex;
        flex-direction: column;
    }

    .venue-name {
        color: var(--primary);
    }

    .venue-location {
        font-size: 20px;
        color: var(--secondary);
    }

    .other-images-grid {
        display: grid;
        grid-template-rows: 49.5% 49.5%;
        grid-template-columns: 49.5% 49.5%;
        height: inherit;
        gap: 5px;
    }

    .grid-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .placeholder-box {
        border-color:#ccc;
        border-style: dashed;
        color: #ccc;
        font-size: 14px;
    }

    .show-more-images-overlay {
        position: relative;
        z-index: 1;
    }

    .black-overlay {
        background-color: rgba(0, 0, 0, 0.35);
        z-index: 1000;
    }

    .show-more-images-btn {
        font-size: 19px;
    }

    .show-more-images-btn:hover {
        text-decoration: underline;
    }

    .rating {
        color: var(--highlight);
    }

    select:hover {
        cursor: pointer;
        border: 1px solid gray;
    }

    select:focus, input:focus {
        outline: none;
        box-shadow: none;
        border: 1px solid gray;
    }

    .total {
        font-size: 20px;
    }

    button[type="submit"] {
        transition: background-color 0.2s ease-in-out;
    }

    button[type="submit"]:disabled {
        cursor: not-allowed;
    }

    .btn-active {
        border: none;
        border-width: 2px;
        background-color: var(--accent) !important;
        color: white !important;
        cursor: pointer;
        opacity: 1;
    }

    .btn-active:hover {
        background-color: #e03070 !important;
    }

    .custom-accordion-button {
        background-color: var(--background);
        border: none !important;
        box-shadow: none !important;
        color: black !important;
        padding-left: 0;
    }

    .custom-accordion-button:not(.collapsed) {
        background-color: var(--background);
    }

    .custom-accordion-box {
        border: none !important;
        background-color: #eaeaea;
    }

    .show-more-images-container {
        background: rgba(0, 0, 0, 0.8);
        z-index: 1050;
        left: 0;
    }

    .carousel {
        --vc-nav-background: rgba(255, 255, 255, 0.7);
        --vc-nav-border-radius: 100%;
        padding: 0 4rem;
        margin: 0 auto;
    }

    .close-show-more-images-container {
        position: absolute;
        top: 25px;
        right: 40px;
        font-size: 1.8rem;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
    }

    .reviewer {
        font-size: 17px;
    }

    .review-comment {
        font-size: 16px;
    }

    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        z-index: 1001;
    }

    .popup {
        position: relative;
        width: 50%;
        background: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
    }

    .close-btn {
        position: absolute;
        top: 5px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2em;
        cursor: pointer;
        color: #333;
    }

    .custom-btn {
        width: fit-content;
        padding: 0.75rem 2rem;
        color: white;
        transition: background-color 0.2s ease-in-out;
    }

    .confirm {
        color: white;
        background-color: var(--highlight);
    }
    
    .confirm:hover {
        color: white;
        background-color: var(--highlight-dark-50);
    }

    .cancel {
        color: white;
        background-color: red;
    }

    .cancel:hover {
        color: white;
        background-color: darkred;
    }
</style>
