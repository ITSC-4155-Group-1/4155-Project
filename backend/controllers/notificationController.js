const userModel = require('../model/userModel')
const notificationModel = require('../model/notificationModel')

exports.getNotifications = (req, res, next) =>{
    let userId = req.body.id
    return notificationModel.find()
    .then((notifications) =>{
        if(notifications){
            return notifications
        }
        else{
            return
        }
    })
    .catch(err => next(err))
}

exports.setToRead = (req, res, next) => {
    let notification = req.body.id
    notificationModel.findByIdAndUpdate(notification, {$set: {read: true}})
    .then((updatedNotification) =>{
        if(updatedNotification){
            res.status(200).json({success: "Notification updated successfully"})
        }
        else{
            res.status(404).json({invalid: "Notification could not be found"})
        }
    })
    .catch(err=>next(err))     
}

exports.createnotification = (req, res, next) => {
    let user = req.session.id
    let notification = new notificationModel(req.body)
    notification.for = user
    notification.save()
    .then((notification) =>{
        res.status(200).json({success: "notification added successfully"})
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            res.status(400).json({invalid: err.message})
        }
        next(err);
    })
}

exports.deleteNotification = (req, res, next) =>{
    let notification = req.body.id
    notificationModel.findByIdAndDelete(notification)
    .then((deletedNotification) => {
        if(deletedNotification){
            res.status(200).json({success: "Notification deleted successfully"})
        }
        else{
            next(new Error('Notification does not exist').status(404))
        }
    })
    .catch(err => next(err))
}
