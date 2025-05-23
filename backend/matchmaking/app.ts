import fastify, { FastifyInstance, FastifyRequest } from "fastify"
import fastifyWebsocket from "@fastify/websocket";
import serverObject from "./config/serverObject.js";
import matchmakingRoutes from "./routes/macthmakingRoutes.js";
import { WebSocket } from "ws";

const app = fastify(serverObject);

app.register(fastifyWebsocket);

app.get('/lol', { websocket: true }, (connection) => {

    const { socket }: WebSocket = connection;

    console.log(`Client connected ${socket.readyState}`)

    socket.on('message', (message: string) => {
        console.log('Received:', message.toString())
        socket.send(`You said: ${message}`)
    })

    socket.on('close', () => {
        console.log('Client disconnected')
    })
})

app.register(async function (appInstance: FastifyInstance) {
    appInstance.register(matchmakingRoutes, { prefix: "/matchmaking" });

}, { prefix: "api/v1"});


export default app;