const venueModel = require('../model/venueModel')


exports.getVenues = (req, res, next) =>{
    return venueModel.find()
}

exports.createVenue = (req, res, next) => {
    let venue = new venueModel(req.body)
    venue.buyerId = req.session.user
    venue.images = req.files.map(file => `/images/${file.originalname}`)
    venue.save()
    .then((venue) =>{
        res.status(200).json({"success": "Venue created successfully"})
    })
    .catch((err) => {
        if(err.name == "ValidationError"){
            res.status(400).json({"invalid": "Unable to create venue"})
            console.log(err.message)
        }
        else{
            next(err)
        }
    })
}

