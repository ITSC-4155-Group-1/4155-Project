const bookingModel = require('../model/bookingModel')
const userModel = require('../model/userModel')
const venueModel = require('../model/venueModel')
const reviewModel = require('../model/reviewModel')

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
            return res.status(200).json({ success: true, venues })
        }
        else{
            res.status(404).json({ success: false, message: "No venues exist" })
        }
    })
    .catch(err => next(err))
}



exports.getVenue = (req, res, next) => {
    let id = req.params.id // getting the id from the url not the body (not a post request)
    venueModel.findById(id)
    .then((venue) =>{
        if(venue){
            userModel.findById(venue.host)
            .then((host) => {
                res.status(200).json({ success: true, venue, host })
            })
            .catch(err => next(err))
        }
        else{
            res.status(404).json({ success: false, message: "Venue does not exist" })
        }
    })
    .catch(err => next(err))
}


exports.deleteVenue = (req, res, next) =>{
    let venueId = req.params.id
    Promise.all([venueModel.findByIdAndDelete(venueId), bookingModel.deleteMany({venueId: venueId}), reviewModel.deleteMany({venueId: venueId})])
    .then((deletedItems) => {
        if(deletedItems){
            res.status(200).json({success: "Venue deleted successfully"})
        }
        else{
            res.status(404).json({ success: false, message: "Venue does not exist" })
        }
    })
    .catch(err => next(err))
}

exports.updateVenue = (req, res, next) => {
    let venue = req.body
    venue.images = req.files.map(file => `/images/${file.filename}`)
    let venueId = req.params.id
    console.log(venue);
    venueModel.findByIdAndUpdate(venueId, venue, {runValidators: true, new: true})
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
    venue.images = req.files.map(file => `/images/${file.filename}`)
    venue.save()
    .then((venue) =>{
        res.status(200).json({
            success: "Venue created successfully",
            venue: venue
        });
        
    })
    .catch((err) => {
        if(err.name == "ValidationError"){
            res.status(400).json({ invalid: "Unable to create venue" })
        }
        else{
            next(err)
        }
    })
}

