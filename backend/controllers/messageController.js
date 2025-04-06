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

exports.createRoom = (io) =>{
  let roomId = ''
  let currUser = ''
  let reciever = ''
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    //data is an object containing:
    //receiver: Str
    //currUser: Str
    socket.on("joinRoom", (data) => {
      currUser = data.currUser
      receiver = data.receiver
      roomId = [currUser, reciever].sort()
      roomId = roomId[0].concat(roomId[1])
      socket.join(roomId)
      Promise.all([userModel.findById(currUser), userModel.findById(reciever), messageModel.find({senderId: currUser, receiverId: reciever})])
      .then((usersAndMessages) =>{
        io.to(roomId).emit("Load data", usersAndMessages)
      })
      .catch(err => next(err))
    })
    // Function to send message
    socket.on('message', (msg)=>{
      let message = new message({senderId: msg.sender, recieverId: msg.receiver, message: message})
      message.save()
      .then((message) =>{
        io.to(roomId).emit('messageBack', msg)
      })
      .catch(err => next(err))
    })
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
    
  })
  
  // Function to disconnect
  
  
}