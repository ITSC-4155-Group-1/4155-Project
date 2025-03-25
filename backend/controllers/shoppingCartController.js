const ShoppingCart = require('../model/shoppingCartModel');

//View Shopping Cart
exports.getShoppingCart = async (req, res) => {
    try {
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const cartItems = await ShoppingCart.find({ user: userId }).populate('venue');
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve shopping cart' });
    }
};

//Add to Shopping Cart
exports.addToShoppingCart = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const existingItem = await ShoppingCart.findOne({ user: userId, venue: venueId });
        if (existingItem) {
            return res.status(400).json({ error: 'Venue already in cart' });
        }

        const newCartItem = new ShoppingCart({ user: userId, venue: venueId });
        await newCartItem.save();

        res.status(201).json({ message: 'Venue added to shopping cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

//Remove from Shopping Cart
exports.removeFromShoppingCart = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const deletedItem = await ShoppingCart.findOneAndDelete({ user: userId, venue: venueId });

        if (!deletedItem) {
            return res.status(404).json({ error: 'Venue not found in cart' });
        }

        res.status(200).json({ message: 'Venue removed from shopping cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};
