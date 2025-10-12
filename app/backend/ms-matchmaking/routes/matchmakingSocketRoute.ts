import ws from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { RawData } from "ws"; // type
import { matchMakingRouteSchema } from "./schema.js";

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
// const matchQueue: { id: number, socket: WebSocket }[] = [];
const pingpongQueue = new Map<number, ws.WebSocket>();
const tictactoeQueue = new Map<number, ws.WebSocket>();

const processQueue = async (queue: Map<number, ws.WebSocket>, type: string) => {
    const matchedPlayers = [...queue.entries()].slice(0, 2);
    const IDs = matchedPlayers.map(([key, val]) => key);
    IDs.forEach(ID => queue.delete(ID));

    try {
        const res = await fetch('http://ms-game:5010/game/room/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MS_MATCHMAKING_API_KEY}`
            },
            body: JSON.stringify({ 
                playersIds: IDs,
                gameType: type,
            })
        })

        if (!res.ok)
            throw new Error(`API "Game service" error: ${res.status}`);

        const data = await res.json();

        matchedPlayers.forEach(([key, val]) => {
            if (val.readyState === WebSocket.OPEN) {
                val.send(JSON.stringify({
                    roomId: data.roomId,
                    opponentId: IDs.find(ID => ID != key)
                }));
            }
        });
    } catch (err: any) {
        matchedPlayers.forEach(([key, val]) => {
            if (val.readyState === WebSocket.OPEN) {
                val.close(1001, JSON.stringify({
                    message: err.message
                }));
            }
        });
        console.error('Failed to create Room: ', err);
    }
}

const matchmakingSocketRoutes = async function (app: FastifyInstance) {

    app.get("/:gameType/join", { websocket: true, schema: matchMakingRouteSchema }, (connection: ws.WebSocket, req: FastifyRequest) => {
        const { gameType } = req.params as { gameType: string };
        const queue = gameType === 'pingpong' ? pingpongQueue : tictactoeQueue;
        console.log('queue, gameType', queue, gameType);
        connection.on('message', (message: RawData) => {
            try {
                const data = message.toString('utf-8');
                const dataObj = JSON.parse(data);
    
                queue.set(dataObj.id, connection);
                if (queue.size >= 2)
                {
                    setImmediate(() => {
                        processQueue(queue, gameType);
                    })
                }
            } catch (err) {
                console.error('Error processing message:', err);
                if (connection.readyState === WebSocket.OPEN) {
                    connection.close(1001, `Invalid JSON: ${err}`);
                }
            }
        })

        connection.on('close', () => {
            for (const [key, value] of queue.entries()) {
                if (value == connection) {
                    queue.delete(key);
                    break ;
                }
            }
        });
    })
    
}



export default matchmakingSocketRoutes;