const mongoose = require ('mongoose');

const shoppingCartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true }
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);