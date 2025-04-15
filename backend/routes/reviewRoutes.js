const express = require('express')
const venueMiddleware = require('../middleware/venueMiddleware')
const reviewController = require('../controllers/reviewController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const bookingMiddleware = require('../middleware/bookingMiddleware')
const exp_router = express.Router()

exp_router.post('/', validator.alreadyLoggedIn, reviewController.createReview)

//Set review to read
//exp_router.put('/', validator.alreadyLoggedIn, reviewController.setToRead)

//View all existing reviews
exp_router.get('/:id', validator.alreadyLoggedIn, reviewController.getReviewsForVenue)
module.exports = exp_router