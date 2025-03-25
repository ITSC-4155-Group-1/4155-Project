const mongoose = require ('mongoose')
const {Schema} = mongoose

const reviewSchema = new Schema({
    venueId: {type: Schema.Types.ObjectID, ref: 'Venue'},
    reviewerId: {type: Schema.Types.ObjectID, ref: 'User'},
    review : {type: String},
    numStars: {type: Number, required: [true, 'Venue name is required']}
})

module.exports = mongoose.model("Message", messageSchema)