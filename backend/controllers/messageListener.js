const messageModel = require('../model/messageModel')
const userModel = require('../model/userModel')
module.exports = (io) =>{
  let roomId = ''
  io.on('connection', (socket) => {
    //data is an object containing:
    //receiver: Str
    //currUser: Str
    socket.on("joinRoom", (data) => {
      let currUser = data.currUser
      let reciever = data.reciever
      roomId = [currUser, reciever].sort()
      roomId = roomId[0].concat(roomId[1])
      socket.join(roomId)
      Promise.all([userModel.findById(currUser), userModel.findById(reciever), messageModel.find({senderId: currUser, receiverId: reciever})])
      .then((usersAndMessages) =>{
        [sender, reciever, messages] = usersAndMessages
        io.to(roomId).emit(usersAndMessages)
      })
      .catch(err => next(err))
    })
    
  })
  // Function to send message
  socket.on('message', (data)=>{
    //data.message: Str: The message the user sent
    //data.senderId: Objectid
    //data.receiverId: Objectid
    message = new messageModel(data)
    message.save()
    .then((message) =>{
      io.to(roomId).emit('messageToClient', data)
    })
    .catch(err => next(err))
  })
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
  
  // Function to disconnect
  
  
}