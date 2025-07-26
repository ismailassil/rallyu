
// import Fastify from "fastify";
// import { Server } from "socket.io";

// const fastify = Fastify({
//   logger: true,
// });


// const io = new Server(fastify.server, {
//   cors: {
//     origin: "http://localhost:3000",
//     // methods: ["GET", "POST"],
//   }
// });

// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id}`);
  
//   socket.on('getM', (data) => {
//     console.log(`Received getM: ${data}`);
//     socket.emit('messageReceived', data);
//   });
  
//   socket.on('sendM', (data) => {
//     console.log(`Received sendM: ${data}`);
//     io.emit('newMessage', data);
//   });
  
//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// })

// fastify.listen({ port: 4000, host:'0.0.0.0'}, (err, address) => {
//   if (err) {
//     fastify.log.error(err);
//     // process.exit(1);
//   }
//   fastify.log.info(`Server is running at ${address}`);
// });
