import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

// const matchQueue: { id: number, socket: WebSocket }[] = [];
const matchQueue = new Map<number, WebSocket>();

const matchmakingSocketRoutes = async function (app: FastifyInstance) {
    app.addHook("onReady", async () => {
        console.log("Well , looking for players...")
        setInterval(() => {
            if (matchQueue.size >= 2) {
                const keys = matchQueue.keys();
                const room = {
                    roomId: crypto.randomUUID(),
                    players: {
                        playerId1: keys.next().value,
                        playerId2: keys.next().value
                    }
                };

                (async () => {
                    // Fetch data from game service!
                    // NATS
                })();

                matchQueue.delete(room.players.playerId1 as number);
                matchQueue.delete(room.players.playerId2 as number);
            }
            console.log("Matching: ", matchQueue.size);
        }, 3000);
    });

    app.get("/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
		console.log("==========[/join] NEW CONNECTION");
        if (connection.OPEN) {
            // matchQueue.push(connection);
            // socketPlayers.set(id++, connection)
        }

        connection.on('message', (message) => {
            const data = message.toString('utf-8');
            const dataObj = JSON.parse(data);
            console.log(`Received ${dataObj.type}`);

            // if (dataObj.type == "MATCH-CANCEL")
            //     matchQueue.splice(matchQueue.indexOf({ id: dataObj.data.id, socket: connection }), 1);

            if (dataObj.type == "ESTABLISHED-CONNECTION") {
                console.log(dataObj);
                matchQueue.set(dataObj.id, connection);
            }

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
    })
}

export default matchmakingSocketRoutes;