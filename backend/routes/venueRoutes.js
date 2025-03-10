const express = require('express')
const venueController = require('../controllers/venueController')
const validator = require ('../middleware/userMiddleware')
const {upload} = require('../middleware/venueMiddleware')

const exp_router = express.Router()


//Display all venues (user does not have to be logged in)
exp_router.get('/', venueController.getVenues)

exp_router.post('/', upload.array('images'), venueController.createVenue)

exp_router.put('/', upload.array('images'), venueController.updateVenue)

module.exports = exp_router