<script setup>
    import { ref, onMounted } from 'vue';
    import { venues } from "../../../mockdata";
    import VenueCard from "./VenueCard.vue";

    const venueList = ref(venues);
    const showModal = ref(false);
    const activeSection = ref('personal-info');
    const updatePasswordDiv = ref(false);
    const storedUser = ref({
        email: '',
        firstName: '',
        lastName: ''
    });


    const parseUser = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                storedUser.value = {
                    email: parsedUser._value.email,
                    firstName: parsedUser._value.token.firstName || 'Guest',
                    lastName: parsedUser._value.token.lastName || 'User'
                };
            } catch (e) {
                console.error(e);
            }
        }
    }

    onMounted(() => {
        parseUser();
    });

    const openModal = () => {
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const confirmDelete = () => {
        alert("Account Deleted!"); 
        closeModal();
    };

    const setActiveSection = (section) => {
        activeSection.value = section;
    };

    const toggleUpdatePasswordDiv = () => {
        updatePasswordDiv.value = !updatePasswordDiv.value;
    }

    const updatePassword = async () => {
        // backend call to update password
        updatePassword.value = false;
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
                <a class="logout" href="#">Logout</a>
            </div>

            <div class="main-content">
                <div v-if="activeSection === 'personal-info'">
                    <div class="profile-card">
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar">
                        <div class="profile-info">
                            <h3 class="username">
                                {{ storedUser.firstName }} {{ storedUser.lastName }}
                            </h3>
                        </div>
                    </div>

                    <div class="email-password">
                        <p><strong>Email:</strong> {{ storedUser.email }}</p>
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
                                    >
                                </div>
                                <div class="mb-3">
                                    <label for="repeatPassword" class="form-label">Re-type Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="repeatPassword"
                                        required
                                    >
                                </div>
                                <div class="d-flex gap-2">
                                    <button type="submit" class="rounded password-change-btn confirm" @click="updatePassword">Confirm</button>
                                    <button type="submit" class="rounded password-change-btn cancel" @click="toggleUpdatePasswordDiv">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="venues" v-if="activeSection === 'personal-info'">
                        <h3>Current Venues</h3>
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
    width: 20%;
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

.password-change-btn {
    border: none;
    color: white;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.25s ease-in-out;
}

.confirm {
    background-color: var(--highlight);
}

.confirm:hover {
    background-color: var(--highlight-dark-50);
}

.cancel {
    background-color: red;
}

.cancel:hover {
    background-color: rgb(209, 0, 0);
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
    z-index: 10000; /* Increase the z-index */
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

/* Delete Button*/
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

</style>