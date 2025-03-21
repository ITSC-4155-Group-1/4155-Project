<script setup>
    import { ref } from 'vue';
    import { parseUser } from "../utils/userUtils"
    
    const activeSection = ref('personal-info');
    const user = parseUser();

    const setActiveSection = (section) => {
        activeSection.value = section;
    };

    const newMessage = ref('');
    const messages = ref([
        { sender: 'Santiago', text: "Hey, how are you?", opened: true },
        { sender: 'Me', text: "I'm good, what about you?", opened: false }
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
        <div class="d-flex gap-2">
            <div
                class="sidebar flex-shrink-0 overflow-y-auto d-flex flex-column justify-content-start w-25 p-4"
            >
                <div class="d-flex flex-column gap-2">
                    <div class="d-flex align-items-center justify-content-between">
                        <h2 class="sidebar-title">Messages</h2>
                        <img
                            class="searchIcon bg-none"
                            src="/images/search.png"
                            alt="Search"
                            role="button"
                        />
                    </div>
                    
                    <div class="d-flex align-items-center gap-3 mb-2">
                        <button
                            class="px-3 py-2 rounded border-0 filterButtons"
                            role="button"
                            :class="{ active: activeSection === 'all-messages' }"
                            @click="setActiveSection('all-messages')">
                            <span>All</span>
                        </button>
                        <button
                            class="px-3 py-2 rounded border-0 filterButtons"
                            role="button"
                            :class="{ active: activeSection === 'unread-messages' }"
                            @click="setActiveSection('unread-messages')">
                            <span>Unread</span>
                        </button>
                    </div>
                </div>

                <!-- each person's messages -->
                <ul class="sidebar-menu list-style-none m-0 p-0">
                    <li
                        class="d-flex align-items-center p-3"
                        role="button"
                        :class="{ active: activeSection === 'Person 1' }"
                        @click="setActiveSection('Person 1')"
                    >
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar">
                        <span>Santiago</span>
                    </li>
                    <li
                        class="d-flex align-items-center p-3"
                        role="button"
                        :class="{ active: activeSection === 'Person 2' }"
                        @click="setActiveSection('Person 2')"
                    >
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar">
                        <span>Lil Guy</span>
                    </li>
                    <li
                        class="d-flex align-items-center p-3"
                        role="button"
                        :class="{ active: activeSection === 'Person 3' }"
                        @click="setActiveSection('Person 3')"
                    >
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar">
                        <span>\._./</span>
                    </li>
                </ul>
            </div>

            <!-- only need this 'template'; information needs to update based on the 'activeSection' variable -->
            <div 
                v-if="activeSection === 'Person 1'"
                class="chat-box d-flex flex-column w-100 flex-fill"
            >
                <div
                    class="message-inbox d-flex flex-column flex-fill overflow-y-auto p-4"
                >
                    <div
                        class="d-flex flex-column g-1 pb-2 flex-fill overflow-y-auto"
                    >
                        <div
                            v-for="(message, index) in messages"
                            :key="index"
                            :class="['message', message.sender === 'Me' ? 'sent' : 'received']"
                        >
                            {{ message.text }}
                        </div>
                    </div>

                    <div class="d-flex gap-3 py-3">
                        <input
                            v-model="newMessage"
                            @keyup.enter="sendMessage"
                            type="text"
                            placeholder="Type a message..." 
                            class="messageInput w-100 p-2 border-0 rounded"
                        />
                        <button
                            class="submitMessageBtn rounded border-0 px-3 py-2"
                            @click="sendMessage"
                            role="button"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .searchIcon {
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
        color: var(--primary);
    }

    .filterButtons {
        transition: background 0.3s;
    }

    .filterButtons.active {
        background: #dbeafe;
        font-weight: bold;
    }

    .filterButtons:hover {
        background: #c5e0ff;
    }

    .sidebar-menu li {
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

    .chat-box {
        height: 90vh;
    }

    .message-inbox {
        background: #f9f9f9;
    }

    .message {
        padding: 10px 15px;
        border-radius: 7px;
        max-width: 50%;
        word-wrap: break-word;
        margin: 3px 0;
    }

    .message.received {
        background: #e0e0e0;
        align-self: flex-start;
    }

    .message.sent {
        background: var(--primary);
        color: white;
        align-self: flex-end;
        margin-right: 5px;
    }

    .messages-container:has(.chat-profile:empty) {
        justify-content: space-between;
    }

    .messageInput { 
        outline: none;
        background: var(--background);
    }

    .submitMessageBtn {
        background: var(--primary);
        color: white;
        transition: 0.3s;
    }

    .submitMessageBtn:hover {
        background: #283593;
    }
</style>