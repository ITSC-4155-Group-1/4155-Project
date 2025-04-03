const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

// View all venues
exports.getVenues = (req, res, next) =>{
    venueModel.find()
    .then((venues) =>{
        if(venues){
            res.status(200).json({ success: true, venues })
        }
        else{
            res.json(200).json({ success: true, message: "No venues exist" })
        }
    })
    .catch(err => next(err))
}
// Get my venues
exports.viewMyVenues = (req, res, next) => {
    let id = req.session.user

    venueModel.find({buyerId: id})
    .then((venues) =>{
        if(venues){
            res.status(200).json({ success: true, venues })
        }
        else{
            next(new Error('No venues exist').status(404))
        }
    })
    .catch(err => next(err))
}



exports.getVenue = (req, res, next) => {
    let id = req.params.id // getting the id from the url not the body (not a post request)
    venueModel.findById(id)
    .then((venue) =>{
        if(venue){
            res.status(200).json({ success: true, venue })
        }
        else{
            next(new Error('Venue does not exist').status(404))
        }
    })
    .catch(err => next(err))
}


exports.deleteVenue = (req, res, next) =>{
    let venueId = req.body.id
    Promise.all([venueModel.findByIdAndDelete(venueId), bookingModel.deleteMany({venueId: venueId}), reviewModel.deleteMany({venueId: venueId})])
    .then((deletedItems) => {
        if(deletedItems){
            res.status(200).json({success: "venue deleted successfully"})
        }
        else{
            next(new Error('venue does not exist').status(404))
        }
    })
    .catch(err => next(err))
}

exports.updateVenue = (req, res, next) =>{
    let venue = new venueModel(req.body)
    let venueId = req.body.id
    venue.venueId = venueId
    venueModel.findByIdAndUpdate(venueId, venue, {runValidators: true})
    .then((venue) =>{
        if(venue){
            res.status(200).json({success: "Venue updated successfully"})
        }
        else{
            res.status(404).json({invalid: "Venue could not be found"})
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    }) 
}


exports.createVenue = (req, res, next) => {
    let venue = new venueModel(req.body)
    venue.host = req.session.user
    venue.images = req.files.map(file => `/images/${file.originalname}`)
    venue.save()
    .then((venue) =>{
        res.status(200).json({"success": "Venue created successfully"})
    })
    .catch((err) => {
        if(err.name == "ValidationError"){
            res.status(400).json({"invalid": "Unable to create venue"})
        }
        else{
            next(err)
        }
    })
}

