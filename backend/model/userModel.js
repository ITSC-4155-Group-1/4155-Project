const mongoose = require ('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'first name is required']},
    lastName: {type: String, required: [true, 'last name is required']},
    email: {type: String, required: [true, 'email address is required'], unique: [true, 'this email address has been used'] },
    password: { type: String, required: [true, 'password is required'] },
    image: {type: String, required: 'Image is required'}
})

module.exports = mongoose.model("User", userSchema)