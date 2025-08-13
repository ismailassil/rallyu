import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction} from "fastify";
import serverConfig from "./config/serverConfig";
import connectDatabase from "./database/database";
import dotenv from "dotenv";
import { initTournamentModel, TournamentModel } from "./models/tournamentModel";
import { initTournamentMatchesModel, TournamentMatchesModel } from "./models/tournamentMatchesModel";
import {Codec, JetStreamClient, NatsConnection} from "nats"
import natsPlugin from "./plugin/natsPlugin";
import tournamentRoutes from "./routes/tournamentRoutes";

declare module "fastify" {
	interface FastifyInstance {
		tournamentModel: TournamentModel,
		tournamentMatchesModel: TournamentMatchesModel,
		js: JetStreamClient,
		nc: NatsConnection,
		jsonCodec: Codec<unknown>
	}
}

const app = fastify(serverConfig);

dotenv.config({ path: '../../api-gateway/.env' });

app.register(natsPlugin, {
	NATSURL: process.env.NATS_URL ?? "",
	NATSUSER: process.env.NATS_USER ?? "",
	NATSPASS: process.env.NATS_PASSWORD ?? ""
}).after((err) => app.log.error(err));

app.register(connectDatabase).after((err) => app.log.error(err));

app.ready(async () => {
	await initTournamentMatchesModel(app);
	await initTournamentModel(app);
	app.tournamentModel.startTournaments();
	app.tournamentMatchesModel.monitorReadyMatches();
});

app.register(tournamentRoutes, { prefix: "/api/v1/tournament"});

app.addHook("onClose", function (app: FastifyInstance, done: HookHandlerDoneFunction) {
	// *** Close Database
	app.DB.close((err) => {
		if (err) app.log.error("Database closing failed!");
		else app.log.info("Database closed successfully");
	});

	// *** Close NATS client connection
	app.nc.close();

	done();
});

export default app;