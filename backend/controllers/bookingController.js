const bookingModel = require('../model/bookingModel')
const venueModel = require('../model/venueModel')

exports.createBooking = (req, res, next) => {
    let venueId = req.body.venueId
    Promise.all([bookingModel.find({venueId: venueId}), venueModel.find({_id: venueId})])
    .then((bookingsAndVenue) => {
        if(bookingsAndVenue[1]){
            let startDate = new Date(req.body.bookingStartDate)
            console.log(bookingsAndVenue)
            let endDate = new Date(req.body.bookingEndDate)
            let currentBookings = bookingsAndVenue[0]
            let venue = bookingsAndVenue[1][0]
            console.log(venue.availability[0] - startDate)
            let withinAvailability = venue.availability[0] < startDate && venue.availability[1] > endDate
            let hasNoOverlap = currentBookings.filter(booking => {
                return booking.bookingEndDate >= startDate && booking.bookingStartDate <= endDate
            })

            console.log(hasNoOverlap.length)
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
    })
    .catch(err => next(err))
}