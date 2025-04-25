// const express = require('express');
// const messageController = require('../controllers/messageController');
// const validator = require('../middleware/userMiddleware');

// const exp_router = express.Router();

// // Secure message routes (only logged-in users can access)
// exp_router.get('/', validator.alreadyLoggedIn, messageController.getMessages);
// exp_router.post('/', validator.alreadyLoggedIn, messageController.sendMessage);
// exp_router.delete('/:messageId', validator.alreadyLoggedIn, messageController.deleteMessage);

// module.exports = exp_router;