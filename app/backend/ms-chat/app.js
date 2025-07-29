import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import dbConnector from "./schema/chat.schema.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyIO, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

fastify.register(dbConnector);

fastify.ready().then(() => {
  const io = fastify.io;
  
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    socket.on('getM', (data) => {
      console.log(`Received getM: ${data}`);
      const stmt = fastify.db.prepare('SELECT * FROM message ORDER BY id ASC');
      const messages = stmt.all();
      socket.emit('messageReceived', messages);
    });
    
    socket.on('sendM', (data) => {
      console.log(`Received sendM:`, data);
      const stmt = fastify.db.prepare('INSERT INTO message (senderId, receiverId, text) VALUES (?, ?, ?)');
      const result = stmt.run(data.senderId, data.receiverId, data.text);
      
      io.emit('newMessage', {
        id: result.lastInsertRowid,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text
      });
      
    });
    socket.on("lastMessage", () => {
      const stmt = fastify.db.prepare('SELECT * FROM message WHERE id = (SELECT MAX(id) FROM message);');
      const lastMessage = stmt.get(); // executes the query and returns a single row
      // console.log("======>", JSON.stringify(lastMessage, null, 2));
      socket.emit("lastMessageResult", lastMessage); // send it back to the client
    });
    
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
});

fastify.listen({ port: 4000, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server is running at ${address}`);
});