const mongoose = require ('mongoose')
const {Schema} = mongoose

const messageSchema = new Schema({
    senderId: {type: Schema.Types.ObjectID, ref: 'User'},
    receiverId: {type: Schema.Types.ObjectID, ref: 'User'},
    message: {type: String},
    timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Message", messageSchema)