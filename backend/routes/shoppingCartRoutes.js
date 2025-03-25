const express = require('express');
const validator = require('../middleware/userMiddleware');
const shoppingCartController = require('../controllers/shoppingCartController');

const exp_router = express.Router();

// Ensure the user is logged in to view or manage shoppingCart
exp_router.get('/', validator.alreadyLoggedIn, shoppingCartController.getShoppingCart);
exp_router.post('/', validator.alreadyLoggedIn, shoppingCartController.addToShoppingCart);
exp_router.delete('/', validator.alreadyLoggedIn, shoppingCartController.removeFromShoppingCart);

module.exports = exp_router;