import { app as fastify } from "./app.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

let cached_metrics = "";

// Retrive metrics every 5s
setInterval(async () => {
	try {
		const res = await axios.get("http://api-gateway:4004/inter-metrics", {
			auth: {
				// TODO: .env
				username: "admin",
				password: "password",
			},
		});
		cached_metrics = res.data;
		fastify.log.info("Fetched latest metrics data");
	} catch (err) {
		fastify.log.error(err);
	}
}, 5000);

fastify.get("/metrics", (req, rep) => {
	rep.header("content-Type", "text/plain; version=0.0.4");
	return cached_metrics || "# No metrics available yet";
});

async function main() {
	try {
		const address = await fastify.listen({ host: "::", port: 9434 }); // TODO: into .env
		fastify.log.info(`Server is running at ${address}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();
