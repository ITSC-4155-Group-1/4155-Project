<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { venues } from '../../../mockdata.js';
    import { useRouter, useRoute } from 'vue-router';
    import { useCartStore } from '../store/cartStore';

    const router = useRouter();
    const cartStore = useCartStore();

    const route = useRoute();
    const venue = ref({});
    const dateRange = ref(null);
    const attendees = ref('');
    const cleaningFee = 200;
    const processing = 50;
    const total = ref(0);
    const isFilled = ref(false);
    const activeIndex = ref(0); // accordion active index

    // TODO: will make a call to the backend to save the venue for the user
    const saveVenue = () => {
        isFilled.value = !isFilled.value;
    };

    const minDate = computed(() => {
        const venueStartDate = new Date(venue.value.availability_start_date);
        const today = new Date();

        return venueStartDate > today ? venueStartDate : today;
    });
    const maxDate = computed(() => venue.value.availability_end_date ? new Date(venue.value.availability_end_date) : null);

    const collapsibleSections = ref([
        { title: "Parking", content: "Ample parking space is available on-site. Parking is free for the first 2 hours, after which a small fee is applied." },
        { title: "Host Rules", content: "Hosts must ensure that guests follow safety protocols. No loud music after 10 PM. Alcohol consumption is allowed in designated areas only." },
        { title: "Cancellation Policy", content: "Cancellations made 14 days prior to the event date will receive a full refund. After that, a 50% refund will be issued if cancelled within 7 days." },
        { title: "Operational Hours", content: "The venue operates from 9 AM to 11 PM daily. Special hours may apply for holidays or special events." },
        { title: "Location", content: "Exact venue location." }
    ]);

    onMounted(() => {
        const venueId = route.params.id;
        venue.value = venues.find(v => v.venue_name === venueId);
    });

    const submitBooking = () => {
        if (!dateRange.value || dateRange.value.length !== 2  || !attendees.value) {
            alert("Please fill out all required fields.");
            return;
        }

        cartStore.setCartDetails({
            host: venue.value.host_id,
            venueName: venue.value.venue_name,
            venuePrice: venue.value.price,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1],
            attendees: attendees.value,
            cleaningFee: cleaningFee,
            processing: processing,
            image: venue.value.image.join(','),
            capacity: venue.value.capacity
        })

        router.push('/cart')
    };

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
            { label: '101-200', value: '101-200' },
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
</script>

<template>
    <div class="w-95 mx-auto">
        <div class="w-100 d-flex justify-content-between align-items-center">
            <div class="venue-name-location mb-1">
                <span class="fs-2 venue-name">
                    {{ venue.venue_name }} 
                    <span class="fs-5">(Hosted by {{ venue.host_id }})</span>
                </span>
                <span class="venue-location">{{ venue.location }}</span>
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
            </div>
        </div>

        <div class="d-flex gap-2 image-gallery"
            v-if="venue.image && venue.image.length"
        >
            <div class="w-50">
                <img
                    :src="venue.image[0]" alt="Venue image"
                    class="w-100 h-100 object-fit-cover d-flex align-items-center justify-content-center overflow-hidden rounded"
                >
            </div>
            <div class="w-50 other-images-grid">
                <template v-if="venue.image.length > 1">
                    <div class="grid-item position-relative" v-for="(image, index) in venue.image.slice(1, 5)">
                        <img  
                            :key="index" 
                            :src="image" 
                            alt="Venue image" 
                            class=" rounded"
                        >
                    </div>
                </template>
                <template v-if="venue.image.length < 5">
                    <div
                        v-for="index in 5 - venue.image.length"
                        :key="'placeholder-' + index"
                        class="placeholder-box d-flex justify-content-center align-items-center rounded w-100 h-100 border-2"
                    ></div>
                </template>
            </div>
        </div>
        <p v-else>No image available</p>

        <div class="d-flex justify-space-around gap-5">
            <div class="w-65 my-2">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div v-if="venue.rating">
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
                            {{ venue.rating }} / 5.0 
                        </span>
                    </div>

                    <div v-if="venue.capacity">
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
                <p class="fs-6">{{ venue.venue_description }}</p>
                
                <!-- Collapsible Sections -->
                <div class="accordionContainer">
                    <!-- <div class="accordion">
                        <div
                            class="accordion-item"
                            v-for="(section, index) in collapsibleSections"
                            :key="index"
                        >
                            <h2 class="accordion-header" :id="'heading' + index">
                                <button 
                                    class="accordion-button custom-accordion-button collapsed fs-5"
                                    type="button" 
                                    :data-bs-toggle="'collapse'" 
                                    :data-bs-target="'#collapse' + index" 
                                    :aria-expanded="true"
                                    :aria-controls="'collapse' + index"
                                >
                                    {{ section.title }}
                                </button>
                            </h2>
                            <div 
                                :id="'collapse' + index" 
                                class="accordion-collapse collapse"
                                :class="{'show': index === 0}"
                                :data-bs-parent="'#accordionExample' + index">
                                <div class="accordion-body">
                                    {{ section.content }}
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="accordion" id="venueAccordion">
                        <div v-for="(section, index) in collapsibleSections" :key="index" class="accordion-item">
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
            </div>

            <!-- Booking Form Container -->
            <div class="w-35 my-2 border border-2 border-dark p-4 rounded booking-modal bg-light">
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
                            required
                            class="date-picker-input"
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

    .w-65 {
        width: 65%;
    }

    .w-35 {
        width: 35%;
    }

    .image-gallery {
        max-height: 56vh;
        overflow: hidden;
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

    .accordion-item {
        border: none !important;
        background-color: #eaeaea;
    }
</style>
