const reviewModel = require('../model/reviewModel')
const venueModel = require('../model/venueModel')

exports.getReviewsForVenue = (req, res, next) =>{
    let venueId = req.body.id
    return reviewModel.find()
    .then((reviews) =>{
        if(reviews){
            return reviews
        }
        else{
            next(new Error('No reviews exist').status(404))
        }
    })
    .catch(err => next(err))
}

exports.createReview = (req, res, next) => {
    let venueId = req.body.id
    let review = new reviewModel(req.body)
    let userId = req.session.id
    review.venueId = venueId
    review.save()
    .then((review) =>{
        res.status(200).json({success: "review added successfully"})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    })
}