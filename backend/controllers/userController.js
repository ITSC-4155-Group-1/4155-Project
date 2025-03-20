const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const venueModel = require("../model/venueModel");

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    userModel.findOne({ email: email })
    .then((user) => {
        if (!user) {
            return res.status(400)
            .json({ invalid: "Invalid email. Please try another one." });
        } else {
            bcrypt.compare(password, user.password).then((result) => {
            if (result) {
                req.session.user = user._id;
                req.session.firstName = user.firstName;
                req.session.lastName = user.lastName;
                res.json({ success: `Login successful`, token: req.session });
            } else {
                return res.status(400)
                .json({ invalid: "Incorrect password. Please try again." });
            }
            });
        }
    })
    .catch((err) => next(err));
};

exports.signup = (req, res, next) => {
    let { firstName, lastName, email, password } = req.body;

    userModel.findOne({ email })
    .then((existingUser) => {
        if (existingUser) {
            return res.status(400).json({ invalid: "Email is already in use" });
        }
        bcrypt.hash(password, 10)
        .then((hashedPass) => {
            let newUser = new userModel({
                firstName,
                lastName,
                email,
                password: hashedPass,
            });

            newUser.save()
            .then(() => {
                res.status(201).json({
                    success: "Account created successfully, please login",
                });
            })
            .catch((err) => {
                if (err.code === 11000) {
                    res.status(400).json({ invalid: "Email is already in use" });
                } else if (err.name === "ValidationError") {
                    res.status(400).json({ invalid: err.message });
                } else {
                    next(err);
                }
            });
        })
        .catch((err) => {
            next(err);
        });
    })
    .catch((err) => {
        next(err);
    });
};

exports.logout = (req, res, next) => {
    if (!req.session) {
        return res.status(400).json({ invalid: "No active session" });
    }
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        } else {
            res.json({ success: "Successfully logged out of session" });
        }
    });
};

// Account deletion
exports.deleteAccount = (req, res, next) =>{
    let userId = req.body.id
    venueModel.find({host: userId})
    .then((venues) =>{
        if(venues){
            let venueIds = venues.filter(venue => venue.id)
            Promise.all([venueModel.deleteMany({_id: venueIds}), bookingModel.deleteMany({venueId: {$in: venueIds}}), userModel.findByIdAndDelete(userId)])
            .then((deletedItems) => {
                if(deletedItems){
                    if (!req.session) {
                        return res.status(400).json({ invalid: "No active session" });
                    }
                    req.session.destroy((err) => {
                        if (err) {
                            return next(err);
                        } else {
                            res.json({ success: "Successfully deleted account and removed session" });
                        }
                    })
                }
                else{
                    next(new Error('Account does not exist').status(404))
                }
            })
            .catch(err => next(err))
        }
        else{
            next(new Error('No venues exist').status(404))
        }
    })
    .catch(err => next(err))
}
// Update User account settings

exports.updateUser = (req, res, next) =>{
    let password = req.body.password
    bcrypt.hash(password, 10)
    .then((hashedPass) => {
    let userId = req.body.id
    user.findByIdAndUpdate(userId, {password: hashedPass}, {runValidators: true})
    .then((user) =>{
        if(user){
            res.status(200).json({success: "User updated successfully"})
        }
        else{
            res.status(404).json({invalid: "User could not be found"})
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    }) 
    })
}
