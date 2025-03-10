const venueModel = require('../model/venueModel')


exports.getVenues = (req, res, next) =>{
    return venueModel.find()
}

exports.getVenue = (req, res, next) => {
    let id = req.body.id
    venueModel.findById(id)
    .then((venue) =>{
        if(venue){
            return venue
        }
        else{
            next(new Error('Venue does not exist').status(404))
        }
    })
    .catch(err => next(err))
}


exports.deleteVenue = (req, res, next) =>{
    let venueId = req.body.id
    venueModel.findByIdAndDelete(venueId)
    .then((venue) => {
        if(venue){
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
    venue.findByIdAndUpdate(venueId, venue, {runValidators: true})
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

