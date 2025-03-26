const express = require('express')
const userController = require('../controllers/userController')
const validator = require ('../middleware/userMiddleware')
const inputValidator = require('../middleware/validation')
const exp_router = express.Router()
const {upload} = require('../middleware/venueMiddleware')

exp_router.post('/signup', validator.isNotLoggedIn, inputValidator.accountValidation, inputValidator.displayValidation, userController.signup)

exp_router.post('/login', validator.isNotLoggedIn, inputValidator.loginValidation, inputValidator.displayValidation, userController.login)

exp_router.get('/logout', validator.alreadyLoggedIn, userController.logout)

//Delete Account
exp_router.delete('/', validator.alreadyLoggedIn, userController.deleteAccount )
//Update Account Settings (Password, profile picture)
exp_router.put('/', validator.alreadyLoggedIn, upload.array('image'), userController.updateUser)
module.exports = exp_router