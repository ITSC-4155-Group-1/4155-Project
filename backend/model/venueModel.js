const mongoose = require ('mongoose')
const {Schema} = mongoose

const venueSchema = new Schema({
    venueName: {type: String, required: [true, 'Venue name is required']},
    description: {type: String, required: [true, 'Venue description is required']},
    host: {type: Schema.Types.ObjectID, ref: 'User'},
    state: {type: String, required: [true, 'Venue location is required']},
    city: {type: String, required: [true, 'Venue location is required']},
    address: {type: String, required: [true, 'Venue location is required']},
    zipCode: {type: Number, required: [true, 'Venue location is required']},
    price: {type: Number, required: [true, 'Venue price is required'], minValue: [0.01, 'Price must be at least $0.01']},
    availability_start_date: {type: Date, required: [true, 'Venue availability start date is required']},
    availability_end_date: {type: Date, required: [true, 'Venue availability end date is required']},
    capacity: {type: Number, required: [true, 'Venue Capacity is required']},
    images: [{type: String, required: [true, 'Image is required']}],
    ratingAvg: {type: Number},
    numRatings: {type: Number, default: 0}
})

module.exports = mongoose.model("Venue", venueSchema)