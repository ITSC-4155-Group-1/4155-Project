const messageModel = require('../model/messageModel')
const userModel = require('../model/userModel')
exports.getUsersToMessage = (req, res, next) =>{
  messageModel.distinct('receiverId', {$and : [{senderId: req.session.user}]})
  .then((users) => {
    let userIds = users.filter(user => user._id)
    userModel.find({_id : { $in: userIds }})
    .then((messagedUsers) => {
      return messagedUsers
    })
    .catch(err => next(err))
  })
  .catch(err => next(err))
}