const express = require('express');
const validator = require('../middleware/userMiddleware');
const favoritesController = require('../controllers/favoritesController');

const exp_router = express.Router();

// Ensure the user is logged in to view or manage shoppingCart
exp_router.get('/', validator.alreadyLoggedIn, favoritesController.getFavorites);
exp_router.post('/', validator.alreadyLoggedIn, favoritesController.addToFavorites);
exp_router.delete('/', validator.alreadyLoggedIn, favoritesController.removeFromFavorites);

module.exports = exp_router;