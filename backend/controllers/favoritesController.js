const Favorites = require('../model/favoritesModel');

//View Favorites
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.session.user;

        const favoritedVenues = await Favorites.find({ user: userId }).populate('venue');
        if (!favoritedVenues || favoritedVenues.length === 0) {
            return res.status(200).json({ message: 'No favorites found' });
        }
        res.status(200).json({ favoritedVenues });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve shopping cart' });
    }
};

// gets a specific favorite by id tied to the user
exports.getFavoriteById = async (req, res) => {
    try {
        const userId = req.session.user;
        if (!userId) {
            return res.status(200).json({ isFavorited: false })
        }

        const venueId = req.params.id;

        const favorite = await Favorites.findOne({ user: userId, venue: venueId });
        if (!favorite) {
            return res.status(200).json({ isFavorited: false });
        }

        res.status(200).json({ isFavorited: true });
    } catch(error) {
        res.status(500).json({ error: 'Failed to retrieve favorite' });
    }
}

//Add to favorites
exports.addToFavorites = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;

        const newFavorite = new Favorites({ user: userId, venue: venueId });
        if (newFavorite.user === userId) {
            return res.status(403).json({ error: 'Unable to favorite your own venue.' });
        }
        await newFavorite.save();

        res.status(201).json({ message: 'Venue added to your favorites.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add the venue to your favorites' });
    }
};

//Remove from Favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const { venueId } = req.body;
        const userId = req.session.user;

        const deletedItem = await Favorites.findOneAndDelete({ user: userId, venue: venueId });

        if (!deletedItem) {
            return res.status(400).json({ error: 'Venue must be favorited first.' });
        }

        if (deletedItem.user === userId) {
            return res.status(403).json({ error: 'Unable to unfavorite your own venue.' });
        }

        res.status(200).json({ message: 'Venue removed from your favorites.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove venue from your favorites' });
    }
};
