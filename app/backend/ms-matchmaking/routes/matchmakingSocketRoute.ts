import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { RawData } from "ws"; // type

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
// const matchQueue: { id: number, socket: WebSocket }[] = [];
const pingpongQueue = new Map<number, WebSocket>();
const tictactoeQueue = new Map<number, WebSocket>();

const processQueue = async (queue: Map<number, WebSocket>, mode: string) => {
    const matchedPlayers = [...queue.entries()].slice(0, 2);
    const IDs = matchedPlayers.map(([key, val]) => key);
    IDs.forEach(ID => queue.delete(ID));

    try {
        const res = await fetch('http://ms-game:5010/game/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MS_MATCHMAKING_API_KEY}`
            },
            body: JSON.stringify({ 
                playersIds: IDs,
                gameType: mode
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

    app.get("/tictactoe/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
        connection.on('message', (message: RawData) => {
            try {
                const data = message.toString('utf-8');
                const dataObj = JSON.parse(data);
    
                tictactoeQueue.set(dataObj.id, connection);
                if (tictactoeQueue.size >= 2)
                {
                    setImmediate(() => {
                        processQueue(tictactoeQueue, 'tictactoe');
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
            for (const [key, value] of tictactoeQueue.entries()) {
                if (value == connection) {
                    tictactoeQueue.delete(key);
                    break ;
                }
            }
        });
    })

    app.get("/pingpong/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
        connection.on('message', (message: RawData) => {
            try {
                const data = message.toString('utf-8');
                const dataObj = JSON.parse(data);
    
                pingpongQueue.set(dataObj.id, connection);
                if (pingpongQueue.size >= 2)
                {
                    setImmediate(() => {
                        processQueue(pingpongQueue, 'pingpong');
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
            for (const [key, value] of pingpongQueue.entries()) {
                if (value == connection) {
                    pingpongQueue.delete(key);
                    break ;
                }
            }
        });
    })
    
}



export default matchmakingSocketRoutes;