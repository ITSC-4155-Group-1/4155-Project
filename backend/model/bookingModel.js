const mongoose = require ('mongoose')
const {Schema} = mongoose

const bookingSchema = new Schema({
    buyerId: {type: Schema.Types.ObjectID, ref: 'User'},
    venueId: {type: Schema.Types.ObjectID, ref: 'Venue'},
    bookingStartDate: {type: Date, required: [true, 'Venue availability start date is required']},
    bookingEndDate: {type: Date, required: [true, 'Venue availability end date is required']},
    numAttendees: {type: String, required: [true, 'Number of attendees is required'], enum: ['1-40', '41-100', '101-199', '200+']}
})

module.exports = mongoose.model("Booking", bookingSchema)