const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.createBooking = (req, res, next) => {
    let venueId = req.body.id
    Promise.all([bookingModel.find({venueId: venueId}), venueModel.find({_id: venueId})])
    .then((bookingsAndVenue) => {
        if(bookingsAndVenue[1]){
            let startDate = new Date(req.body.bookingStartDate)
            let endDate = new Date(req.body.bookingEndDate)
            let currentBookings = bookingsAndVenue[0]
            let venue = bookingsAndVenue[1][0]
            let withinAvailability = venue.availability[0] < startDate && venue.availability[1] > endDate
            let hasNoOverlap = currentBookings.filter(booking => {
                return booking.bookingEndDate >= startDate && booking.bookingStartDate <= endDate
            })

            if(hasNoOverlap.length){
                res.status(400).json({invalid: "Booking overlaps with another booking"})
            }
            else if(!withinAvailability){
                res.status(400).json({invalid: "Booking is not within venue's availability"})
            }
            else{
                let booking = new bookingModel(req.body)
                booking.venueId = venue._id
                booking.save()
                .then((booking) =>{
                    res.status(200).json({success: "Booking added successfully"})
                })
                .catch(err => next(err))
            }
        }
        else{
            next(new Error('Booking does not exist').status(404))
        }
    })
    .catch(err => next(err))
}
exports.deleteBooking = (req, res, next) =>{
    let bookingId = req.body.id
    bookingModel.findByIdAndDelete(bookingId)
    .then((booking) => {
        if(booking)
    })
}