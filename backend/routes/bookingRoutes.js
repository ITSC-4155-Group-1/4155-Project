const express = require('express')
const bookingController = require('../controllers/bookingController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const bookingMiddleware = require('../middleware/bookingMiddleware')
const exp_router = express.Router()

exp_router.post('/', validator.alreadyLoggedIn, bookingMiddleware.isBooker, bookingMiddleware.isBookingAvailable, inputValidator.bookingValidation, inputValidator.displayValidation, bookingController.createBooking)

exp_router.delete('/', validator.alreadyLoggedIn, bookingMiddleware.isBooker, bookingController.deleteBooking)

//View existing bookings other users have made for my venue
exp_router.get('/host', validator.alreadyLoggedIn, bookingMiddleware.isHost, bookingController.viewVenueBookings)

//View all existing bookings I have made. No validator to check if user is correct as controller checks session cookie
exp_router.get('/', validator.alreadyLoggedIn, bookingController.viewMyBookings)

//Update booking I have made
exp_router.put('/', validator.alreadyLoggedIn, bookingMiddleware.isBooker, bookingMiddleware.isBookingAvailable, inputValidator.bookingValidation, inputValidator.displayValidation, bookingController.updateBooking)
module.exports = exp_router