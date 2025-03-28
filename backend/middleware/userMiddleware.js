
exports.alreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).json({ error: "Unauthorized: You must be logged in to perform this action." });
    }
};

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.session.user){
        return next();
    }
    else{
        res.status(400).json({invalid: 'You are already logged in'})
    }
};