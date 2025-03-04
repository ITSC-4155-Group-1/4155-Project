const { body, validationResult } = require('express-validator');

exports.accountValidation = [
                                body('firstName', 'First name is required').notEmpty().trim().escape(),
                                body('lastName', 'Last name is required').notEmpty().trim().escape(),
                                body('email', 'Email is not a valid email address').isEmail().trim().escape().normalizeEmail(),
                                body('password', 'A password of length 1 to 30 is required').isLength({min: 1, max: 30}).trim().escape(),
]

exports.displayValidation = (req, res, next) => {
    let validationErrors = validationResult(req)
    console.log(validationErrors)
    if(!validationErrors.isEmpty()){
        res.status(400).json({'invalid': validationErrors.array().map(err => err.msg)})
    }
    else{
        console.log("pass")
        next()
    }
}
