const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.isBookingAvailable = (req, res, next) =>{
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
                next()
            }
        }
        else{
            next(new Error('Venue does not exist').status(404))
        }
    })
    .catch(err => next(err))
}