const reviewModel = require('../model/reviewModel')
const venueModel = require('../model/venueModel')

exports.getReviewsForVenue = (req, res, next) =>{
    let venueId = req.params.id
    reviewModel.find({ venueId })
    .populate('reviewerId')
    .then((reviews) =>{
        if(reviews){
            return res.status(200).json({ success: true, reviews });
        }
        else{
            res.status(200).json({ success: false, message: "No reviews found." });
        }
    })
    .catch(err => next(err))
}

exports.createReview = (req, res, next) => {
    let venueId = req.body.id
    let review = new reviewModel(req.body)
    let userId = req.session.user
    review.venueId = venueId
    review.reviewerId = userId
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