const multer = require('multer')
const path = require('path')
const venueModel = require('../model/venueModel')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/dist/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
exports.upload = multer({  
  storage: storage,
  limits: {filesize: 1024 * 1024 * 10},
  fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
      if(allowedTypes.includes(file.mimetype)){
          cb(null, true)
      }
      else{
          cb(new Error("Invalid file type, please use png, jpg, or jpeg"))
      }
  }
})

exports.isHost = (req, res, next) => {
  let hostId = req.session.user
  let venueId = req.params.id
  venueModel.findById(venueId)
  .then((venue) => {
      if(venue){
          if (venue.host.toString() === hostId) {
            next();
          } else {
            return res
              .status(400)
              .json({ error: "You are not the host of this venue" });
          }
      }
      else{
          return res.status(404).json({error: "Venue does not exist"})
      }        
  })
  .catch(err => next(err))
}

  
  