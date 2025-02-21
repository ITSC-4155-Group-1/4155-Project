const mongoose = require ('mongoose')
const {Schema} = mongoose

const venueSchema = new Schema({
    buyer_id: {type: Schema.Types.ObjectID, ref: 'User'},
    venue_name: {type: String, required: [true, 'Venue name is required']},
    description: {type: String, required: [true, 'Venue description is required']},
    host: {type: 'ObjectId', ref: 'User'},
    location: {type: String, required: [true, 'Venue location is required']},
    price: {type: Number, required: [true, 'Venue price is required'], minValue: [0.01, 'Price must be at least $0.01']},
    availability_start_date: {type: Date, required: [true, 'Venue availability start date is required']},
    availability_end_date: {type: Date, required: [true, 'Venue availability end date is required']},
    capacity: {type: Number, required: [true, 'Venue Capacity is required']},
    images: [{type: String, required: 'Image is required'}],
    ratingAvg: {type: Number},
    numRatings: {type: Number, default: 0}
})

module.exports = mongoose.model("Venue", venueSchema)