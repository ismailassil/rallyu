import { JetStreamClient, NatsConnection, connect } from "nats";
import { JSONCodec } from "nats";

interface NatsOpts {
	NATS_URL: string;
	NATS_USER: string;
	NATS_PASSWORD: string;
}

class NatsConnectionManager {
	public nc!: NatsConnection;
	public js!: JetStreamClient;
	public jsonC = JSONCodec();

	constructor(private opts: NatsOpts) {}

	public async connect() {
		this.nc = await connect({
			servers: this.opts.NATS_URL,
			// servers: 'nats://localhost:4222', // TODO: to be changed to container name `nats`
			user: this.opts.NATS_USER,
			pass: this.opts.NATS_PASSWORD,
			name: 'User Management',
		});

		this.js = this.nc.jetstream();

		// fastify.log.info('[NATS] Server is up on ' + nc.getServer());
		console.log('[NATS] Server is up on ' + this.nc.getServer());
	}

	public async close() {
		await this.nc.drain();
		await this.nc.close();
		console.log('[NATS] Connection closed');
	}
}

export default NatsConnectionManager;