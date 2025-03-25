const Favorites = require('../model/favoritesModel');

//View Favorites
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const cartItems = await Favorites.find({ user: userId }).populate('venue');
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve shopping cart' });
    }
};

//Add to favorites
exports.addToFavorites = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const existingItem = await Favorites.findOne({ user: userId, venue: venueId });
        if (existingItem) {
            return res.status(400).json({ error: 'Venue already in cart' });
        }

        const newCartItem = new Favorites({ user: userId, venue: venueId });
        await newCartItem.save();

        res.status(201).json({ message: 'Venue added to shopping cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

//Remove from Favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const deletedItem = await Favorites.findOneAndDelete({ user: userId, venue: venueId });

        if (!deletedItem) {
            return res.status(404).json({ error: 'Venue not found in cart' });
        }

        res.status(200).json({ message: 'Venue removed from shopping cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};
