<script setup>
    import { ref, computed, reactive, watch, onMounted } from 'vue';
    import { parseUser } from "../utils/userUtils"
    import { messages } from "../../../mockdata"

    const allMessages = ref([...messages]) // stores all the messages (default and newly sent ones)
    const messagesData = ref([...messages]);

    // should default to the most recent person you messaged
    const messagingWho = ref(messages[0]?.from);

    const filterButton = ref('all');
    const filterInput = ref(null);
    const user = parseUser();
    const listOfMessagesNames = ref([...new Set(messages.map(message => message.from))])

    const setMessagingWho = (person) => {
        messagingWho.value = person;
    };

    const markMessagesAsOpened = (person) => {
        allMessages.value = allMessages.value.map(message => {
            if (message.from === person) {
                return { ...message, opened: true };
            }
            return message;
        });
        messagesData.value = [...allMessages.value];
    };

    onMounted(() => {
        markMessagesAsOpened(messagingWho.value);
    });

    watch(messagingWho, (newPerson) => {
        markMessagesAsOpened(newPerson);
    });

    const messagesForASpecificUser = computed(() => {
        return allMessages.value.filter(
            message =>
                message.from === messagingWho.value ||
                (message.to === messagingWho.value && message.from === user?.firstName)
        );
    });

    const setFilterButton = (filter) => {
        if (filter === 'unread') {
            const unreadMessages = messagesData.value.filter(
                message => !message.opened && message.from !== user?.firstName
            );
            listOfMessagesNames.value = [...new Set(unreadMessages.map(message => message.from))];
            messagesData.value = unreadMessages;
        } else {
            messagesData.value = messages;
            listOfMessagesNames.value = [...new Set(messagesData.value.map(message => message.from))];
        }
        filterButton.value = filter;
    };

    const filterSearchBar = () => {
        const filter = filterInput.value?.toLowerCase() || "";
        
        if (filter) {
            const messagesResult = messages.filter(message => 
                message.from.toLowerCase().includes(filter) || 
                message.message.toLowerCase().includes(filter)
            );

            listOfMessagesNames.value = [...new Set(messagesResult.map(message => message.from))];
            messagesData.value = messagesResult;
        } else {
            messagesData.value = messages;
            listOfMessagesNames.value = [...new Set(messages.map(message => message.from))];
        }
    };

    const newMessage = ref('');
    const sendMessage = () => {
        if (newMessage.value.trim()) {
            const newMsg = {
                from: user?.firstName,
                to: messagingWho.value,
                message: newMessage.value,
                timestamp: new Date(),
                opened: false,
            };

            allMessages.value = [...allMessages.value, reactive(newMsg)];
            messagesData.value = [...allMessages.value];

            if (!listOfMessagesNames.value.includes(messagingWho.value)) {
                listOfMessagesNames.value.push(messagingWho.value);
            }

            newMessage.value = '';
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric',
        });
    };
</script>

<template>
    <div>
        <div class="d-flex gap-2">
            <div
                class="sidebar flex-shrink-0 overflow-y-auto d-flex flex-column justify-content-start w-25 p-4"
            >
                <div class="d-flex flex-column gap-3">
                    <div class="w-50">
                        <h2 class="sidebar-title p-0 m-0">Inbox</h2>
                    </div>
                    <div>
                        <form
                            @submit.prevent="filterSearchBar"
                            class="d-flex align-items-center justify-content-between gap-2"
                        >
                            <input
                                v-model="filterInput"
                                type="text"
                                placeholder="Search"
                                class="border-0 w-100 rounded px-2 py-1 outline-none"
                            >
                            <div class="d-flex justify-content-end">
                                <img
                                    class="searchIcon bg-none"
                                    src="/images/search.png"
                                    alt="Search"
                                    role="button"
                                    @click="filterSearchBar"
                                />
                            </div>
                        </form>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3 mb-2">
                        <button
                            class="px-3 py-2 rounded border-0 filterButtons"
                            role="button"
                            :class="{ active: filterButton === 'all' }"
                            @click="setFilterButton('all')">
                            <span>All</span>
                        </button>
                        <button
                            class="px-3 py-2 rounded border-0 filterButtons"
                            role="button"
                            :class="{ active: filterButton === 'unread' }"
                            @click="setFilterButton('unread')">
                            <span>Unread</span>
                        </button>
                    </div>
                </div>

                <!-- each person's messages -->
                <ul
                    v-if="listOfMessagesNames.length > 0"
                    class="sidebar-menu list-style-none m-0 p-0"
                >
                    <li
                        v-for="(name, idx) in listOfMessagesNames"
                        class="d-flex align-items-center p-3"
                        role="button"
                        @click="setMessagingWho(name)"
                        :class="{ active: messagingWho === name }"
                        :key="`${name}_${idx}`"
                    >
                        <img class="avatar" src="/images/profile_4.jpeg" alt="User Avatar"> <!-- this needs to be the other person's pfp -->
                        <span>{{ name }}</span>
                    </li>
                </ul>
                <span v-else class="text-center m-3">No person found.</span>
            </div>

            <!-- only need this 'template'; information needs to update based on the 'activeSection' variable -->
            <!-- the way it the information is displayed may need to change -->
            <div class="chat-box d-flex flex-column w-100 flex-fill">
                <div class="message-inbox d-flex flex-column flex-fill overflow-y-auto p-4">
                    <div class="d-flex flex-column flex-fill overflow-y-auto">
                        <div
                            v-for="(message, index) in messagesForASpecificUser"
                            :key="index"
                            class="d-flex flex-column mb-2"
                        >
                            <div
                                :class="[
                                    'message', message.from === user?.firstName ? 'sent' : 'received'
                                ]"
                            >
                                <div>{{ message.message }}</div>
                            </div>

                            <span
                                :class="['timestamp', message.from === user?.firstName ? 'sent' : 'received']"
                            >
                                {{ formatTimestamp(message.timestamp) }} by {{ message.from === user?.firstName ? 'Me' : message.from }}
                            </span>
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

    .outline-none {
        outline: none;
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

    .timestamp {
        font-size: 0.8rem;
        color: #666;
        margin-top: 4px;
        display: block;
    }

    .timestamp.sent {
        margin-right: 5px;
        align-self: flex-end;
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