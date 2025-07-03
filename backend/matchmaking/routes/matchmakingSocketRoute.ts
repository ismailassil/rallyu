import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

type Players = {
    player1?: WebSocket,
    player2?: WebSocket
}

const matchQueue: WebSocket[] = [];
const waitingQueue = [];
const decisionQueue = [];

const socketPlayers = new Map<number, WebSocket>();
const rooms = new Map<number, Players>();

rooms.set(1, Object.create(null));
let id = 1;

const matchmakingSocketRoutes = async function (app: FastifyInstance) {
    app.addHook("onReady", async () => {
        console.log("Well , looking for players...")
        setInterval(() => {

            if (matchQueue.length >= 2) {
                waitingQueue.push({ player1: matchQueue[0], player2: matchQueue[1]});
                matchQueue[0].send(JSON.stringify({ type: "MATCH-FOUND" }));
                matchQueue[1].send(JSON.stringify({ type: "MATCH-FOUND" }));
                matchQueue.shift();
                matchQueue.shift();
            }

            console.log("Matching: ", matchQueue.length);
            console.log("Waiting: ", waitingQueue.length);
            console.log("Decision: ", decisionQueue.length);

        }, 3000)

        setInterval(() => {

            const players = decisionQueue.find((ele) => ele.length == 2);

            if (players) {
                if (players.player1.status && players.player2.status) {
                    // Make room and set the game up YOOOOOOOO
                } else if (players.player1.status || players.player2.status) {
                    if (players.player1.status == 1)
                        matchQueue.push(players.player1.sock);
                    else
                        matchQueue.push(players.player2.sock)
                }

                decisionQueue.splice(decisionQueue.indexOf(players), 1);
            }
        })
    });

    app.get("/join", { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {
        if (connection.OPEN) {
            // const players: Players | undefined = rooms.get(1);
            
            // if (players && !Object.keys(players).length)
            //     players.player1 = connection;
            // else if (players && Object.keys(players).length == 1)
            //     players.player2 = connection;

            matchQueue.push(connection);
            socketPlayers.set(id++, connection)
        }

        connection.on('message', (message) => {
            const data = message.toString('utf-8');
            const dataObj = JSON.parse(data);
            console.log(`Received ${dataObj}`);

            if (dataObj.type == "MATCH-CONFIRMATION") {
                let player;
                let opponent;
                let done = 0;
                let playersIndex = -1;

                waitingQueue.forEach((val, ind) => {
                    
                    if (val.player1 === connection) {
                        player = val.player1;
                        opponent = val.player2;
                        playersIndex = ind;
                    } else if (val.player2 === connection) {
                        player = val.player2;
                        opponent = val.player1;
                        playersIndex = ind;
                    }
                })
                
                decisionQueue.forEach((val, ind) => {
                    if (val.length == 1 && val.player1.sock == opponent) {
                        val.player2 = { sock: player, status: dataObj.status };
                        done = 1;
                        waitingQueue.splice(playersIndex, 1);
                    }
                });

                if (done == 0)
                    decisionQueue.push({ player1: { sock: player, status: dataObj.status } })
            }

            if (dataObj.type == "MATCH-CANCEL")
                matchQueue.splice(matchQueue.indexOf(connection), 1);

            // for (const [key, value] of rooms.entries()) {
            //     if (value.player1 == connection) {
            //         value.player2?.send(`Player 1 said: ${message}`)
            //         break ;
            //     }
            //     if (value.player2 == connection) {
            //         value.player1?.send(`Player 2 said: ${message}`)
            //         break ;
            //     }
            // }
        })

        connection.on('close', () => {
            console.log("Connection closed!");
            const ind = matchQueue.indexOf(connection);
            
            for (const [key, value] of rooms.entries()) {
                if (value.player1 == connection || value.player2 == connection) {
                    rooms.delete(key);
                    break ;
                }
            }


            for (let i = 0; i < waitingQueue.length; i++) {
                if (waitingQueue[i].player1 === connection || waitingQueue[i].player2 === connection) {
                    const opponent = waitingQueue[i].player1 === connection ?
                        waitingQueue[i].player2 :  waitingQueue[i].player1;
                    
                    matchQueue.push(opponent);
                    waitingQueue.splice(i, 1);
                    break ;
                }
            }

            if (ind !== -1)
                matchQueue.splice(ind, 1);
            console.log(matchQueue.length);

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