
exports.alreadyLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next()
    }
    else{
        console.log(req.session)
        res.status(400).json({invalid: 'You are not logged in yet'})
    }    
}

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.session.user){
        return next();
    }
    else{
        res.status(400).json({invalid: 'You are already logged in'})
    }
};