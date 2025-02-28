const express = require('express')
const userController = require('../controllers/userController')
const validator = require ('../middleware/userMiddleware')
const exp_router = express.Router()

exp_router.post('/signup', validator.isNotLoggedIn, userController.signup)

exp_router.post('/login', validator.isNotLoggedIn, userController.login)

exp_router.get('/logout', validator.alreadyLoggedIn, userController.logout)

module.exports = exp_router