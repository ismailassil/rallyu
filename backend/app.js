import Fastify from "fastify";
import { Server } from "socket.io";
import dbConnector from "./schema/chat.schema.js";

const fastify = Fastify({
  logger: true
});

const start = async () => {
  try {
    // Register the database plugin
    await fastify.register(dbConnector);
    
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    fastify.log.info(`Blog App is running at http://localhost:4000`);
    
    // Create Socket.IO server attached to Fastify's HTTP server
    const io = new Server(fastify.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    
    io.on("connection", (socket) => {
      console.log("Client connected", socket.id);
      
      // Send previous messages when a client connects
      socket.on("getMessages", () => {
        try {
          const messages = fastify.db.prepare("SELECT * FROM message ORDER BY id ASC").all();
          socket.emit("previousMessages", messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      });
      
      socket.on("sendMessage", (data) => {
        console.log("Received message:", data);
        
        // Validate required fields
        if (!data.senderId || !data.receiverId || !data.text) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        io.on('connection', (socket) => {
          socket.on('deleteMessage', ({ userId }) => {
            try {
              // delete only messages for that user (or adapt based on your schema)
              // fastify.db.prepare("DELETE FROM message WHERE user_id = ?").run(userId);
              fastify.db.prepare("DELETE FROM message").run();

        
              // optionally notify client(s)
              socket.emit("messagesDeleted");
            } catch (err) {
              console.error("DB deletion failed:", err);
              socket.emit("error", { message: "Failed to delete messages" });
            }
          });
        });
        
        
        
        // Save message to database
        try {
          const stmt = fastify.db.prepare("INSERT INTO message (senderId, receiverId, text) VALUES (?, ?, ?)");
          const result = stmt.run(data.senderId, data.receiverId, data.text);
          
          // Create message object with the new ID
          const savedMessage = {
            id: result.lastInsertRowid,
            senderId: data.senderId,
            receiverId: data.receiverId,
            text: data.text
          };
          
          // Broadcast to all clients (including sender)
          io.emit("newMessage", savedMessage);
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("error", { message: "Failed to save message" });
        }
      });
      
      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();