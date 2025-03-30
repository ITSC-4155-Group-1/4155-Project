const express = require('express')
const venueController = require('../controllers/venueController')
const bookingController = require('../controllers/bookingController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const bookingMiddleware = require('../middleware/bookingMiddleware')
const venueMiddleware = require('../middleware/venueMiddleware')
const exp_router = express.Router()
const {upload} = require('../middleware/venueMiddleware')


console.log("HERE")
//Display all venues (user does not have to be logged in)
exp_router.get('/', venueController.getVenues)
//Display all venues owned by user
exp_router.get('/user', validator.alreadyLoggedIn, venueController.viewMyVenues)

exp_router.post('/', validator.alreadyLoggedIn, upload.array('images'), inputValidator.venueValidation, inputValidator.displayValidation, venueController.createVenue)

exp_router.put('/', validator.alreadyLoggedIn, venueMiddleware.isHost,  upload.array('images'), inputValidator.venueValidation, inputValidator.displayValidation, venueController.updateVenue)

exp_router.delete('/', validator.alreadyLoggedIn, venueMiddleware.isHost, venueController.deleteVenue)
// exp_router.use('/favorites')

module.exports = exp_router