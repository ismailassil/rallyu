import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

type Players = {
    player1?: WebSocket,
    player2?: WebSocket
}

const matchQueue: web = []

const socketPlayers = new Map<number, WebSocket>();
const rooms = new Map<number, Players>();

rooms.set(1, Object.create(null));
let id = 1;

const matchmakingSocketRoutes = async function (app: FastifyInstance) {
    app.get("/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
        if (connection.OPEN) {
            const players: Players | undefined = rooms.get(1);
            
            if (players && !Object.keys(players).length)
                players.player1 = connection;
            else if (players && Object.keys(players).length == 1)
                players.player2 = connection;

            socketPlayers.set(id++, connection)
        }

        connection.on('message', (message) => {
            console.log(`Received ${message}`);

            for (const [key, value] of rooms.entries()) {
                if (value.player1 == connection) {
                    value.player2?.send(`Player 1 said: ${message}`)
                    break ;
                }
                if (value.player2 == connection) {
                    value.player1?.send(`Player 2 said: ${message}`)
                    break ;
                }
            }
            
        })

        connection.on('close', () => {
            console.log("Connection closed!")

            for (const [key, value] of rooms.entries()) {
                if (value.player1 == connection || value.player2 == connection) {
                    rooms.delete(key);
                    break ;
                }
            }

            for (const [key, value] of socketPlayers.entries()) {
                if (value == connection) {
                    socketPlayers.delete(key);
                    break ;
                } 
            }
        })

    })
}

export default matchmakingSocketRoutes;