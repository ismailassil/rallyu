import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
// const matchQueue: { id: number, socket: WebSocket }[] = [];
const matchQueue = new Map<number, WebSocket>();

const matchmakingSocketRoutes = async function (app: FastifyInstance) {
    app.addHook("onReady", async () => {
        console.log("Well , looking for players...")
        const processQueue = async () => {
            console.log(`matchQueue size: ${matchQueue.size}`);
            matchQueue.forEach((val, key) => {
                console.log(key);
            });
            if (matchQueue.size >= 2) {
                const keys = Array.from(matchQueue.keys()).slice(0, 2);

                try {
                    const res = await fetch('http://ms-game:5010/game/create-room', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${MS_MATCHMAKING_API_KEY}`
                        },
                        body: JSON.stringify({ playersIds : keys })
                    })
                    
                    if (!res.ok)
                        throw new Error(`API "Game service" error: ${res.status}`);

                    const data = await res.json();
    
                    keys.forEach(key => {
                        matchQueue.get(key)?.send(JSON.stringify(data))
                    });
                    keys.forEach(key => matchQueue.delete(key));
                } catch (err) {
                    console.error('Failed to create Room: ', err);
                }
            }
            setTimeout(processQueue, 3000);
        }
        processQueue();
    });

    app.get("/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
		console.log("==========[/join] NEW CONNECTION");

        try {
            connection.on('message', (message) => {
                const data = message.toString('utf-8');
                const dataObj = JSON.parse(data);
    
                console.log(dataObj);
                matchQueue.set(dataObj.id, connection);
            })
    
            connection.on('close', () => {
                console.log("Connection closed!");
                for (const [key, value] of matchQueue.entries()) {
                    if (value == connection) {
                        matchQueue.delete(key);
                        break ;
                    }
                }
            });
        } catch (err) {
		    return connection.close(1001, `unauthorized: ${err}`);
        }
    })
    
}



export default matchmakingSocketRoutes;