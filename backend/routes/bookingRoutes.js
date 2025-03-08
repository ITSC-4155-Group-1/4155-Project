const express = require('express')
const bookingController = require('../controllers/bookingController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const exp_router = express.Router()

exp_router.post("/", bookingController.createBooking)

module.exports = exp_router