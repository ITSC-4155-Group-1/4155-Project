// const messageModel = require('../model/messageModel')
// const userModel = require('../model/userModel')
module.exports = (io) =>{
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    data = socket.handshake.query
    const room = "test"
    socket.join(room)
    socket.on('message', (msg)=>{
      io.to(room).emit('messageBack', `Message recieved!`)
      io.to(room).emit('messageBack', `Hello, ${socket.id}, here is your message: ${msg}`)
    })
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
    
  })
  // Function to send message
  
  // Function to disconnect
  
  
}