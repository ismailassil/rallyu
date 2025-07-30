import Fastify from 'fastify';
import dbConnector from './plugin/database.plugin.js';
import natsPlugin from './plugin/nats.plugin.js';
import dotenv from '@dotenvx/dotenvx';

dotenv.config();

const fastify = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	},
});

await fastify.register(dbConnector);
await fastify.register(natsPlugin, {
	NATS_URL: process.env.NATS_URL,
	NATS_USER: process.env.NATS_USER,
	NATS_PASSWORD: process.env.NATS_PASSWORD,
});

// fastify.ready().then(() => {
//   const io = fastify.io;

//   io.on('connection', (socket) => {
//     console.log(`Client connected: ${socket.id}`);

//     socket.on('getM', (data) => {
//       console.log(`Received getM: ${data}`);
//       const stmt = fastify.db.prepare('SELECT * FROM message ORDER BY id ASC');
//       const messages = stmt.all();
//       socket.emit('messageReceived', messages);
//     });

//     socket.on('sendM', (data) => {
//       console.log(`Received sendM:`, data);
//       const stmt = fastify.db.prepare('INSERT INTO message (senderId, receiverId, text) VALUES (?, ?, ?)');
//       const result = stmt.run(data.senderId, data.receiverId, data.text);

//       io.emit('newMessage', {
//         id: result.lastInsertRowid,
//         senderId: data.senderId,
//         receiverId: data.receiverId,
//         text: data.text
//       });

//     });
//     socket.on("lastMessage", () => {
//       const stmt = fastify.db.prepare('SELECT * FROM message WHERE id = (SELECT MAX(id) FROM message);');
//       const lastMessage = stmt.get(); // executes the query and returns a single row
//       // console.log("======>", JSON.stringify(lastMessage, null, 2));
//       socket.emit("lastMessageResult", lastMessage); // send it back to the client
//     });

//     socket.on('disconnect', () => {
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
// });

fastify.listen({ port: 4657, host: '0.0.0.0' }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
