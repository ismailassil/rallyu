import fastify, { FastifyInstance} from "fastify"
import fastifyWebsocket from "@fastify/websocket";
import serverObject from "./config/serverObject.js";
import matchmakingRoutes from "./routes/macthmakingRoutes.js";
import matchmakingSocketRoutes from "./routes/matchmakingSocketRoute.js";
import { Codec, connect, Msg, NatsConnection, StringCodec, Subscription } from "nats";
import natsServer from "./config/natsServer.js";
import dotenv from 'dotenv'

dotenv.config();

const app = fastify(serverObject);

app.register(fastifyWebsocket);

// TODO : Complete NATS to link game with matchmaking

app.register(async function (app: FastifyInstance, optiosn) {
    try {
        const nc: NatsConnection = await connect(natsServer);
        const sc: Codec<string> = StringCodec();

        const sub: Subscription = nc.subscribe("lol");

        (async () => {
            for await (const m of sub) {
                console.log(sc.decode(m.data));
            };
        })();
        
        console.log("NATS Server: ", nc.getServer());

    } catch(err: unknown) {
        app.log.fatal(err);
    }
});

app.get('/health', async (request, reply) => {
    console.log("health check!");
    return { status: 'ok', service: 'matchmaking' };
});

app.register(async function (app: FastifyInstance) {

    app.register(async function (app: FastifyInstance) {

        app.register(matchmakingSocketRoutes);
        app.register(matchmakingRoutes);
    }, { prefix: "matchmaking" });

}, { prefix: "api/v1"});

app.after(err => {
    app.log.error(err);
})


export default app;