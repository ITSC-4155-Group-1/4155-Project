
module.exports = (io) =>{
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      data = socket.handshake.query
      const room = `${socket.id}`
      socket.join(room)
      io.to(room).emit('message', `Hello, ${socket.id}`)
      // console.log(socket.id)
      // // Function to get chat history
      socket.on('disconnect', () => {
        console.log('a user disconnected');
      });

    })
    // Function to send message

    // Function to disconnect

    
}