const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

// View all bookings as host
exports.viewVenueBookings = (req, res, next) =>{
    let id = req.params.id
    bookingModel.find({venueId: id})
    .then((bookings) =>{
        if(bookings){
            res.status(200).json({ success: true, bookings });
        }
    })
    .catch(err => next(err))
}

// View all bookings made as a user
exports.viewMyBookings = (req, res, next) => {
    let id = req.session.user
    bookingModel.find({buyerId: id})
    .populate('venueId')
    .then((bookings) =>{
        if(bookings){
            res.status(200).json({ success: true, bookings });
        }
    })
    .catch(err => next(err))
}

// // View specific booking
// exports.viewVenueBooking = (req, res, next) => {
//     let id = req.body.id
//     bookingModel.findById(id)
//     .then((booking) =>{
//         if(booking){
//             return booking
//         }
//         else{
//             next(new Error('Booking does not exist').status(404))
//         }
//     })
//     .catch(err => next(err))
// }

exports.createBooking = (req, res, next) => {
    let venueId = req.body.id
    let userId = req.session.user

    let booking = new bookingModel(req.body)
    booking.venueId = venueId
    booking.buyerId = userId

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
    })
    .catch(err => next(err))
}

exports.updateBooking = (req, res, next) =>{
    let userId = req.session.id
    let booking = new bookingModel(req.body)
    let bookingId = req.body.id
    booking.venueId = venueId
    bookingModel.findByIdAndUpdate(bookingId, booking, {runValidators: true})
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
