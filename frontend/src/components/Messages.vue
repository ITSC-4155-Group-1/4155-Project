<script setup>
    import { ref } from 'vue';
    import { parseUser } from "../utils/userUtils"
    
    const showModal = ref(false);
    const activeSection = ref('personal-info');
    const updatePasswordDiv = ref(false);
    const user = parseUser();

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

    //This is just sample. You can change this 
    const newMessage = ref('');
    const messages = ref([
        { sender: 'Santiago', text: 'Hey, how are you?' },
        { sender: 'Me', text: 'I’m good, what about you?' }
    ]);

    const sendMessage = () => {
        if (newMessage.value.trim()) {
            messages.value.push({ sender: 'Me', text: newMessage.value });
            newMessage.value = '';
        }
    };

</script>

<template>
    <div>
        <div class="messages-container">
            <div class="sidebar">
                <div>
                    <div class="sidebar-header">
                        <h2 class="sidebar-title">Messages</h2>
                        <button class="search-btn">
                            <img src="/images/search.png" alt="Search" />
                        </button>
                    </div>
                    
                    <div class="filter-buttons">
                        <button :class="{ active: activeSection === 'all-messages' }" @click="setActiveSection('all-messages')">
                            All
                        </button>
                        <button :class="{ active: activeSection === 'unread-messages' }" @click="setActiveSection('unread-messages')">
                            Unread
                        </button>
                    </div>
                </div>
                <!-- Here is the code for each person's messages -->
                <ul class="sidebar-menu">
                    <li :class="{ active: activeSection === 'Person 1' }" @click="setActiveSection('Person 1')">
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar"> Santiago
                    </li>
                    <li :class="{ active: activeSection === 'Person 2' }" @click="setActiveSection('Person 2')">
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar"> Lil Guy
                    </li>
                    <li :class="{ active: activeSection === 'Person 3' }" @click="setActiveSection('Person 3')">
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar"> \._./
                    </li>
                </ul>
            </div>
            <!-- Each individual persons texting chat, Only Person 1 works because it is hard coded. -->
            <div v-if="activeSection === 'Person 1'" class="chat-profile">
                <div class="chat-image"> 
                    <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar"><h4>Santiago</h4>
                </div>
                <div class="message-inbox">
                    <div class="messages">
                        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender === 'Me' ? 'sent' : 'received']">
                            {{ message.text }}
                        </div>
                    </div>

                    <!-- Input Box -->
                    <div class="texting-box">
                        <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Type a message..." />
                        <button @click="sendMessage">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages-container {
    display: flex;
    padding: 5px;
    border-top: 2px solid #ddd; 
}

.sidebar {
    width: 25%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-right: 2px solid #ddd; 
    height: 90vh; 
    overflow-y: auto;
    flex-shrink: 0;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}

.search-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #3F51B5;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    margin-bottom: 25px; 
    height: 25px;
    width: 25px;
}

.search-btn img{
    height: 25px;
    width: 25px;
}

.sidebar::-webkit-scrollbar {
    width: 8px;
}

.sidebar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.sidebar-title {
    font-size: 32px;
    margin-bottom: 20px;
    color: #3F51B5;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.filter-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    align-items: center;
}

.filter-buttons button {
    padding: 10px 15px;
    border-radius: 20px; 
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
}

.filter-buttons button.active {
    background: #dbeafe;
    font-weight: bold;
}

.filter-buttons button:hover {
    background: #c5e0ff;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
}

.sidebar-menu li {
    padding: 15px 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s;
    border-radius: 20px; 
}

.sidebar-menu li.active {
    background: #dbeafe;
    font-weight: bold;
}

.sidebar-menu li:hover {
    background: #e7f0ff;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
}

.chat-profile {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 90vh;
    flex-grow: 1;
}

.chat-image{
    display: flex;
    flex-direction: row;
    padding: 20px 20px 20px 20px;
    width: 100%;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid #ddd; 
}

.chat-image h4 {
    margin: 0;  
    line-height: 1;  
    display: flex;
    align-items: center;
}

.chat-image {
    display: flex;
    flex-direction: row;
    padding: 20px;
    width: 100%;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid #ddd;

}

.message-inbox {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px;
    background: #f9f9f9;
}

.messages {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 20px;
    flex: 1; 
    overflow-y: auto;
}

.message {
    padding: 10px 15px;
    border-radius: 15px;
    max-width: 70%;
    word-wrap: break-word;
}

.message.received {
    background: #e0e0e0;
    align-self: flex-start;
}

.message.sent {
    background: #3F51B5;
    color: white;
    align-self: flex-end;
}

.messages-container:has(.chat-profile:empty) {
    justify-content: space-between;
}

.texting-box {
    display: flex;
    padding: 10px;
    background: white;
    border-top: 2px solid #ddd;
    margin-top: auto;
}

.texting-box input {
    flex-grow: 1;
    padding: 10px;
    border: none;
    border-radius: 20px;
    outline: none;
    background: #f0f0f0;
}

.texting-box button {
    padding: 10px 15px;
    margin-left: 10px;
    border: none;
    border-radius: 20px;
    background: #3F51B5;
    color: white;
    cursor: pointer;
    transition: 0.3s;
}

.texting-box button:hover {
    background: #283593;
}
</style>