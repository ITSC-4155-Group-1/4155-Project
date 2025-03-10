const express = require('express')
const bookingController = require('../controllers/bookingController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const bookingMiddleware = require("../middleware/bookingMiddleware")
const exp_router = express.Router()

exp_router.post("/", bookingMiddleware.isBookingAvailable, bookingController.createBooking)

exp_router.delete("/", bookingController.deleteBooking)

//View existing bookings other users have made for my venue

//View all existing I have made


module.exports = exp_router