const express = require('express');
const messageController = require('../controllers/messageController');
const validator = require('../middleware/userMiddleware');

const exp_router = express.Router();

// Secure message routes (only logged-in users can access)
exp_router.get('/', validator.alreadyLoggedIn, messageController.getUsersToMessage);
exp_router.post('/', validator.alreadyLoggedIn, messageController.createGroup);
module.exports = exp_router;