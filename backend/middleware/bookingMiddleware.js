const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.isBookingAvailable = (req, res, next) =>{
    let venueId = req.body.id
    Promise.all([bookingModel.find({venueId: venueId}), venueModel.find({_id: venueId})])
    .then((bookingsAndVenue) => {
        if(bookingsAndVenue[1]){
            let startDate = new Date(req.body.bookingStartDate)
            startDate.setHours(0, 0, 0, 0)
            let endDate = new Date(req.body.bookingEndDate)
            endDate.setHours(0, 0, 0, 0)

            let currentBookings = bookingsAndVenue[0]
            let venue = bookingsAndVenue[1][0]
            let withinAvailability = new Date(venue.availability[0]) <= startDate && new Date(venue.availability[1]) >= endDate
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
            res.status(404).json({invalid: "Venue does not exist"})
        }
    })
    .catch(err => next(err))
}

exports.isBooker = (req, res, next) => {
    let buyer = req.session.user
    let { bookingId } = req.body;
    console.log(bookingId, buyer)
    bookingModel.findById(bookingId)
    .then((booking) => {
        if(booking){
            if(booking.buyerId.toString() === buyer){
                next()
            }
            else {
                res.status(400).json({invalid: "You are not the booker."})
            }
        }
        else{
            res.status(404).json({invalid: "Booking does not exist"})
        }        
    })
    .catch(err => next(err))
  }
  