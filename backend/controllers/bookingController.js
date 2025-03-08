const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.createBooking = (req, res, next) => {
    let venueId = req.body.id
    let booking = new bookingModel(req.body)
    booking.venueId = venueId
    booking.save()
    .then((booking) =>{
        res.status(200).json({success: "Booking added successfully"})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    })
}
exports.deleteBooking = (req, res, next) =>{
    let bookingId = req.body.id
    bookingModel.findByIdAndDelete(bookingId)
    .then((booking) => {
        if(booking){
            res.status(200).json({success: "Booking deleted successfully"})
        }
        else{
            next(new Error('Booking does not exist').status(404))
        }
    })
}

exports.updateBooking = (req, res, next) =>{
    let booking = new bookingModel(req.body)
    let bookingId = req.body.id
    booking.venueId = venueId
    booking.findByIdAndUpdate(bookingId, booking, {runValidators: true})
    .then((booking) =>{
        res.status(200).json({success: "Booking updated successfully"})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    }) 
}

exports.deleteBooking = (req, res, next) =>{
    let booking = new bookingModel(req.body)
    let bookingId = req.body.id
    booking.venueId = venueId
    booking.findByIdAndDelete(bookingId)
    .then((booking) =>{
        res.status(200).json({success: "Booking deleted successfully"})
    })
    .catch(err=> next(err)) 
}