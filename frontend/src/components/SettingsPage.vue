<script setup>
    import { ref, computed } from 'vue';
    import { venues } from "../../../mockdata";
    import VenueCard from "./VenueCard.vue";
    import { parseUser } from "../utils/userUtils"
    import { useUserStore } from '../store/userDetails';
    import { showSuccessToast } from '../utils/toast';

    const venueList = ref(venues);
    const showModal = ref(false);
    const activeSection = ref('personal-info');
    const updatePasswordDiv = ref(false);
    const user = parseUser();
    const userStore = useUserStore();

    const newPassword = ref("");
    const rePassword = ref("");
    const passwordError = ref("");
    const newPfp = ref(null);
    const newPfpPreview = ref(null);
    const changePfpModal = ref(false);

    const openModal = () => {
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const confirmDelete = async () => {
        // TODO: will make a call to the user store and if successful, delete the account and display a success toast, else display a failure toast
        const response = await userStore.deleteUser();
        if (response.success) {
            closeModal();
        } else {
            console.error("Failed to delete account:", response);
        }
    };

    const setActiveSection = (section) => {
        activeSection.value = section;
    };

    const toggleUpdatePasswordDiv = () => {
        updatePasswordDiv.value = !updatePasswordDiv.value;
    }

    const toggleChangePfpModal = () => {
        changePfpModal.value = !changePfpModal.value;
        if (!changePfpModal.value) {
            newPfpPreview.value = null;
        }
    }

    const passwordsMatch = computed(() => newPassword.value === rePassword.value || rePassword.value === "");

    const validatePasswords = () => {
        if (!passwordsMatch.value) {
            passwordError.value = "Passwords do not match.";
            return false;
        }
        passwordError.value = "";
        return true;
    };

    const updatePassword = async () => {
        if (!validatePasswords()) return;

        // TODO: backend call to update password
        // if successful, display the success toast, else display the error toast
        showSuccessToast("Successfully updated your password.");
        updatePassword.value = false;
        updatePasswordDiv.value = false;
    }

    const changePfp = (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error("update pfp failed:", e.target.files);
            return;
        };

        newPfp.value = file;
        newPfpPreview.value = URL.createObjectURL(file);
    }

    const updatePfp = () => {
        if (!newPfp.value) {
            console.error("update pfp failed:", newPfp);
            return;
        }

        // TODO: backend call to update pfp
        // if successful, display the success toast, else display the error toast
        showSuccessToast("Successfully updated your profile picture.");
        changePfpModal.value = false;
    }
</script>

<template>
    <div>
        <div class="settings-container">
            <div class="sidebar">
                <h2 class="sidebar-title">Settings</h2>
                <ul class="sidebar-menu">
                    <li :class="{ active: activeSection === 'personal-info' }" @click="setActiveSection('personal-info')">
                        <i class="icon">👤</i> Personal Info
                    </li>
                    <li :class="{ active: activeSection === 'history' }" @click="setActiveSection('history')">
                        <i class="icon">📜</i> History
                    </li>
                    <li :class="{ active: activeSection === 'favorites' }" @click="setActiveSection('favorites')">
                        <i class="icon">⭐</i> Favorites
                    </li>
                </ul>
                <a class="logout" @click="userStore.logout()">Logout</a>
            </div>

            <div class="main-content">
                <div v-if="activeSection === 'personal-info'">
                    <div class="profile-card">
                        <div class="profile-pic-wrapper">
                            <img class="avatar" :src="user?.pfp" alt="User Avatar" @click="toggleChangePfpModal">
                            <div class="edit-overlay">
                                <span class="editPfpIcon" @click="toggleChangePfpModal">✏️</span>
                            </div>
                        </div>
                        <div class="profile-info">
                            <h3 class="username">
                                {{ user?.firstName }} {{ user?.lastName }}
                            </h3>
                        </div>
                    </div>

                    <div class="email-password">
                        <p><strong>Email:</strong> {{ user?.email }}</p>
                        <p>
                            <strong>Password:</strong> ************ 
                            <i class="edit-icon" @click="toggleUpdatePasswordDiv">✏️</i>
                        </p>
                        <div v-if="updatePasswordDiv" class="w-35">
                            <form @submit.prevent="updatePassword">
                                <div class="mb-3">
                                    <label for="newPassword" class="form-label">New Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="newPassword"
                                        aria-describedby="newPassword"
                                        required
                                        v-model="newPassword"
                                        minlength="8"
                                        maxlength="30"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}"
                                        title="Must contain at least 8 characters, including uppercase and lowercase letters, and a number."
                                    >
                                    <div class="form-text">
                                        Must contain at least 8 characters, including uppercase and lowercase letters, and numbers.
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="repeatPassword" class="form-label">Re-type Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="repeatPassword"
                                        required
                                        v-model="rePassword"
                                        minlength="8"
                                        maxlength="30"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}"
                                        title="Must contain at least 8 characters, including uppercase and lowercase letters, and a number."
                                        @input="validatePasswords"
                                    >
                                    <p v-if="passwordError" class="text-danger mt-1">{{ passwordError }}</p>
                                </div>
                                <div class="d-flex gap-2">
                                    <button type="submit" class="rounded custom-btn confirm" @click="updatePassword">Confirm</button>
                                    <button type="submit" class="rounded custom-btn cancel" @click="toggleUpdatePasswordDiv">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="venues" v-if="activeSection === 'personal-info'">
                        <h3>Your Venues</h3>
                        <div class="venue-list">
                            <div class="row">
                                <div 
                                    v-for="(venue, index) in venueList" 
                                    :key="index + '_' + venue.venue_name" 
                                    class="col-12 col-sm-4 col-md-4 col-lg-3 mb-4"
                                >
                                    <VenueCard :venue="venue" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- there'll be a Your Bookings section here (basically copy pasta from the section above) -->

                    <div v-if="showModal" class="modal-overlay">
                        <div class="modal-popup">
                            <div class="modal-header">
                                <h3>Delete Account</h3>
                                <button class="close-btn" @click="closeModal">×</button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to <strong>delete</strong> your account?<br>This process cannot be undone.</p>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" @click="closeModal">Close</button>
                                <button class="btn btn-danger" @click="confirmDelete">Delete Account</button>
                            </div>
                        </div>
                    </div>

                    <div class="delete-section">
                        <h3>Delete Account</h3>
                        <button class="delete-btn" @click="openModal">Delete your account</button>
                    </div>
                </div>

                <div v-if="activeSection === 'history'">
                    <h2>History</h2>
                    <div class="venues" v-if="activeSection === 'history'">
                        <div class="venue-list">
                            <div class="row">
                                <div 
                                    v-for="(venue, index) in venueList" 
                                    :key="index + '_' + venue.venue_name" 
                                    class="col-12 col-sm-2 col-md-6 col-lg-4 mb-4"
                                >
                                    <VenueCard :venue="venue" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeSection === 'favorites'">
                    <h2>Favorites</h2>
                    <div class="venues" v-if="activeSection === 'favorites'">
                        <div class="venue-list">
                            <div class="row">
                                <div 
                                    v-for="(venue, index) in venueList" 
                                    :key="index + '_' + venue.venue_name" 
                                    class="col-12 col-sm-2 col-md-6 col-lg-4 mb-4"
                                >
                                    <VenueCard :venue="venue" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="changePfpModal" class="overlay">
                    <div class="popup">
                        <button class="close-btn" @click="toggleChangePfpModal">
                            &times;
                        </button>

                        <div>
                            <h3>Update your Profile Picture</h3>
                            <div class="d-flex flex-column gap-1">
                                <div
                                    class="w-50 mx-auto d-flex justify-content-center my-2"
                                >
                                    <img 
                                        class="newPfpImgSize"
                                        :src="newPfpPreview || user?.pfp"
                                        alt="preview pfp"
                                    >
                                </div>
                                <input
                                    type="file"
                                    class="form-control"
                                    id="pfp"
                                    name="pfp"
                                    accept="image/png, image/jpg, image/jpeg"
                                    required
                                    @change="changePfp"
                                >
                            </div>
                            <div class="d-flex gap-2">
                                <button
                                    type="submit"
                                    class="w-50 mt-3 rounded custom-btn confirm"
                                    @click="updatePfp"
                                >
                                    Save
                                </button>
                                <button
                                    type="submit"
                                    class="w-50 mt-3 rounded custom-btn cancel"
                                    @click="toggleChangePfpModal"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
    .settings-container {
        display: flex;
        padding: 10px;
    }

    .sidebar {
        min-width: 15%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .main-content {
        flex-grow: 1; 
        padding: 20px;
        padding-left: 30px;
        overflow-y: auto; 
        display: flex;
        flex-direction: column; 
        height: auto; 
    }

    .sidebar-title {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .sidebar-menu {
        list-style: none;
        padding: 0;
    }

    .sidebar-menu li {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background 0.3s;
    }

    .sidebar-menu li.active {
        background: #dbeafe;
        font-weight: bold;
    }

    .sidebar-menu li:hover {
        background: #e7f0ff;
    }

    .icon {
        margin-right: 10px;
    }

    .logout {
        display: block;
        text-align: center; 
        color: var(--accent);
        text-decoration: none;
        margin-top: auto; 
        padding: 10px;
        font-size: 1.3rem;
        text-decoration: underline;
        cursor: pointer;
    }

    .profile-card {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-radius: 8px;
    }

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 20px;
        cursor: pointer;
        transition: opacity 0.3s ease-in-out;
    }

    .avatar:hover {
        opacity: 0.7;
    }

    .profile-pic-wrapper {
        position: relative;
        display: inline-block;
    }

    .edit-overlay {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 5px;
        border-radius: 50%;
        cursor: pointer;
    }

    .profile-info h3 {
        margin: 0;
        color: #003366;
    }

    .edit-icon {
        cursor: pointer;
        margin-left: 5px;
    }

    .w-35 {
        width: 35vw;
    }

    .custom-btn {
        border: none;
        color: white;
        padding: 0.75rem 1.25rem;
        transition: background-color 0.25s ease-in-out;
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

    .venues {
        margin-top: 20px;
    }

    .venue-list {
        display: flex;
        gap: 10px;
    }

    .venue {
        width: 100%;
        max-width: 200px;
        height: 250px;
        text-align: center;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow: hidden;
    }

    .venue img {
        width: 100%;
        border-radius: 5px;
    }

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e0e0e0;
        font-weight: bold;
    }

    /* Delete button popup*/
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow: visible
    }

    .modal-popup {
        background: white;
        width: 350px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }

    .modal-body {
        padding: 15px 0;
        font-size: 14px;
        color: #333;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
    }

    .btn {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-secondary {
        background: #6c757d;
        color: white;
    }

    .btn-danger {
        background: red;
        color: white;
    }

    .btn:hover {
        opacity: 0.8;
    }


    .delete-section {
        margin-top: 30px;
    }

    .delete-btn {
        background: red;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
    }

    .delete-btn:hover {
        background: darkred;
    }

    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
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

    .newPfpImgSize {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center center;
        border: 1px solid black;
    }

</style>