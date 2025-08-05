import { Msg, NatsConnection } from "nats";

class NatsSubscriber {
	constructor(private nc: NatsConnection) {}

	public async subscribe() {
		const sub = this.nc.subscribe('user.*');
		console.log('[NATS] Subscribed to user.*');

		for await (const msg of sub) {
			this.handleUserRequests(msg);
		}
	}

	private async handleUserRequests(msg: Msg) {
		console.log(`[NATS] Message received on subject: ${msg.subject} == ${msg}`);
	}
}

export default NatsSubscriber;