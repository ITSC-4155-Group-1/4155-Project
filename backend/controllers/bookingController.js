const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.viewVenueBookings = (req, res, next) =>{
    let id = req.body.id

    bookingModel.find({venueId: id})
    .then((bookings) =>{
        if(bookings){
            return bookings
        }
        else{
            next(new Error('Booking does not exist').status(404))
        }
    })
    .catch(err => next(err))
}

exports.viewMyBookings = (req, res, next) => {
    let id = req.body.id

    bookingModel.find({buyerId: id})
    .then((bookings) =>{
        if(bookings){
            return bookings
        }
        else{
            next(new Error('No bookings exist').status(404))
        }
    })
    .catch(err => next(err))
}

exports.viewVenueBooking = (req, res, next) => {
    let id = req.body.id
    bookingModel.findById(id)
    .then((booking) =>{
        if(booking){
            return booking
        }
        else{
            next(new Error('Booking does not exist').status(404))
        }
    })
    .catch(err => next(err))
}

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
    .catch(err => next(err))
}

exports.updateBooking = (req, res, next) =>{
    let booking = new bookingModel(req.body)
    let bookingId = req.body.id
    booking.venueId = venueId
    booking.findByIdAndUpdate(bookingId, booking, {runValidators: true})
    .then((booking) =>{
        if(booking){
            res.status(200).json({success: "Booking updated successfully"})
        }
        else{
            res.status(404).json({invalid: "Booking could not be found"})
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    }) 
}
