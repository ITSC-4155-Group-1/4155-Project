const { body, validationResult } = require('express-validator');

exports.accountValidation = [
    body('firstName', 'First name is required').notEmpty().trim().escape(),
    body('lastName', 'Last name is required').notEmpty().trim().escape(),
    body('email', 'Email is not a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'A password of length 8 to 30 is required').isLength({min: 8, max: 30}).trim().escape(),
]

exports.loginValidation = [
    body('email', 'Email is not a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'A password of length 8 to 30 is required').isLength({min: 8, max: 30}).trim().escape(),
]

exports.venueValidation = [
    body('venueName', 'Venue name is required').notEmpty().trim().escape(),
    body('description', 'Description is required').notEmpty().trim().escape(),
    body('state', 'State name is required').notEmpty().trim().escape(),
    body('city', 'City name is required').notEmpty().trim().escape(),
    body('address', 'Address is required').notEmpty().trim().escape(),
    body('zipCode', 'Zip Code name is required').isInt({ min: 1 }),
    body('capacity', 'Capacity must be at least 1').isInt({min: 1}),
    body('price',).isInt({min: 1, max: 100000000}),
    body('availability').isArray().custom((dates) =>{
        dates.forEach((date) => {
            if(!Date.parse(date)){
                throw new Error("Dates are not valid")
            }
        })
        return true
    })

]

exports.bookingValidation = [
    body('bookingStartDate', 'Start date must be valid').trim().isISO8601().toDate(),
    body('bookingEndDate', 'End date must be valid').trim().isISO8601().toDate(),
    body('numAttendees', 'Number of attendees must be at least 1').notEmpty().trim().escape(),
]

exports.displayValidation = (req, res, next) => {
    let validationErrors = validationResult(req)
    console.log(validationErrors)
    if(!validationErrors.isEmpty()){
        res.status(400).json({'invalid': validationErrors.array().map(err => err.msg)})
    }
    else{
        next()
    }
}
