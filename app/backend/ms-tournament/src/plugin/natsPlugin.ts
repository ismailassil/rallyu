import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { connect, JSONCodec, NatsConnection } from "nats";

const natsPlugin = async function (app: FastifyInstance, options) {
    try {
		const { NATSURL, NATSUSER, NATSPASS } = options;

        const nc: NatsConnection = await connect({
			servers: NATSURL,
			user: NATSUSER,
			pass: NATSPASS
		});
        app.log.info("NATS Server: ", nc.getServer());

		app.decorate("nc", nc).decorate("js", nc.jetstream()).decorate("jsonCodec", JSONCodec());
    } catch(err: unknown) {
        app.log.fatal(err);
    }
};

export default fp(natsPlugin, { name: "nats-plugin" });