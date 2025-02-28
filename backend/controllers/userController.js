const userModel = require('../model/userModel')
const bcrypt = require('bcrypt');


exports.login = (req, res) => {
    //Implement login functionality
    let email = req.body.email;
    let password = req.body.password;
    userModel.findOne({email: email})
    .then(user =>{
        if(!user){
            res.json({'invalid': 'User does not exist'})
        }
        else{
            bcrypt.compare(password, user.password)
            .then(result =>{
                if(result){
                    req.session.user = user._id
                    res.json({'success':`Login successful`})
                }
                else {
                    res.json({'invalid': 'Incorrect password'})
                }
            })
        }
    })
    .catch(err => next(err));
}

exports.signup = (req, res, next) => {
    //Implement signup functionality
    
    let newUser = new userModel(req.body)
    //Hash password
    let pass = req.body.password
    if(pass){
        bcrypt.hash(pass, 10)
        .then(hashedPass => {
            newUser.password = hashedPass;
            newUser.save()
            .then(user =>{
                console.log("Success")
                res.json({'success':`Account created successfully, please login`})
            })
            .catch(err =>{
                if(err.code === 11000) {
                    res.json({'invalid': 'Email is already in use'})
                }
                else if(err.name = 'ValidationError') {
                    res.json({'invalid': err.message})
                }
                else {  
                    next(err)
                }
            })
        })
        .catch(err => next(error));
    }
}

exports.logout = (req, res) => {
    //Implement logout functionality
    req.session.destroy(err=>{
        if(err){
            return next(err);
        } 
        else{
            res.json({"success": "Successfully logged out of session" })
        }
    })
}


//Middleware

