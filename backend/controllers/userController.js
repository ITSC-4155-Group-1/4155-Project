const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");

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

        if (!password) {
            return res.status(400).json({ invalid: "Password is required" });
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