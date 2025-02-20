const mongoose = require ('mongoose')
const {Schema} = mongoose

const notificationSchema = new Schema({
    userId: {type: Schema.Types.ObjectID, ref: 'User'},
    notification: {type: String},
    timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Notification", notificationSchema)