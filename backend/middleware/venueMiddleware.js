const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/public/images')
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
  let venueId = req.body.id
  venueModel.findById(venueId)
  .then((venue) => {
      if(venue){
          if(venue.host === hostId){
              next()
          }
          else {
              next(new Error('You are not the host of this venue').status(400))
          }
      }
      else{
          next(new Error('Venue does not exist').status(404))
      }        
  })
  .catch(err => next(err))
}

  
  