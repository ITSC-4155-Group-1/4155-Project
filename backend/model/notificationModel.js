const mongoose = require ('mongoose')
const {Schema} = mongoose

const notificationSchema = new Schema({
    for: {type: Schema.Types.ObjectID, ref: 'User'},
    notification: {type: String},
    timestamp: {type: Boolean, default: false}
})

module.exports = mongoose.model("Notification", notificationSchema)