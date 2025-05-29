import fastify, { FastifyInstance} from "fastify"
import fastifyWebsocket from "@fastify/websocket";
import serverObject from "./config/serverObject.js";
import matchmakingRoutes from "./routes/macthmakingRoutes.js";
import matchmakingSocketRoutes from "./routes/matchmakingSocketRoute.js";

const app = fastify(serverObject);

app.register(fastifyWebsocket);

app.register(async function (app: FastifyInstance) {

    app.register(async function (app: FastifyInstance) {

        app.register(matchmakingSocketRoutes)
        app.register(matchmakingRoutes);
    }, { prefix: "matchmaking" });

}, { prefix: "api/v1"});


export default app;