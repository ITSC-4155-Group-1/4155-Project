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
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // data = socket.handshake.query
    const room = "test"
    //data is an object containing:
    //receiver: Str
    socket.on("joinRoom", (data) => {
      let currUser = req.session.user
      let roomId = [currUser, reciever].sort()
      roomId = roomId[0].concat(roomId[1])
      socket.join(roomId)
      Promise.all([userModel.findById(currUser), userModel.findById(reciever), messageModel.find({senderId: currUser, receiverId: reciever})])
      .then((usersAndMessages) =>{
        [sender, reciever, messages] = usersAndMessages
      })
    })
    
  })
  // Function to send message
  socket.on('message', (msg)=>{
    io.to(room).emit('messageBack', `Message recieved!`)
    io.to(room).emit('messageBack', `Hello, ${socket.id}, here is your message: ${msg}`)
  })
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
  
  // Function to disconnect
  
  
}