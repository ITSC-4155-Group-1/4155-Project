const express = require('express')
const venueMiddleware = require('../middleware/venueMiddleware')
const notificationController = require('../controllers/notificationController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const bookingMiddleware = require('../middleware/bookingMiddleware')
const exp_router = express.Router()

exp_router.post('/', notificationController.createnotification)

exp_router.delete('/', validator.alreadyLoggedIn,  notificationController.deleteNotification)

//Set notification to read
exp_router.put('/', validator.alreadyLoggedIn, notificationController.setToRead)

//View all existing notifications
exp_router.get('/', validator.alreadyLoggedIn, notificationController.getNotifications)
module.exports = exp_router