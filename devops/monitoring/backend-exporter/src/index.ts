import { app as fastify } from "./app.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

let cached_metrics = "";

const GATEWAY_PORT = process.env.GATEWAY_PORT;

// Retrive metrics every 5s
setInterval(async () => {
	try {
		const res = await axios.get(
			`http://api-gateway:${GATEWAY_PORT}/inter-metrics`,
			{
				auth: {
					username: `${process.env.USER}`,
					password: `${process.env.PASSWORD}`,
				},
			}
		);
		cached_metrics = res.data;
		fastify.log.info("Fetched latest metrics data");
	} catch (err) {
		fastify.log.error(err);
	}
}, 5000); // 5s

fastify.get("/metrics", (req, rep) => {
	rep.header("content-Type", "text/plain; version=0.0.4");
	return cached_metrics || "# No metrics available yet";
});

const PORT = parseInt(process.env.PORT || "9434");

async function main() {
	try {
		const address = await fastify.listen({
			host: "::",
			port: PORT,
		});
		fastify.log.info(`Server is running at ${address}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();
