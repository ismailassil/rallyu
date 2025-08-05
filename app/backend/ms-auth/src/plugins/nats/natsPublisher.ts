import { JSONCodec, JetStreamClient } from "nats";

class NatsPublisher {
	constructor(private js: JetStreamClient, private jsonC = JSONCodec()) {}

	public async publishNotification(data: any) {
		const subject = 'notification.dispatch';
		const payload = this.jsonC.encode(data);
		await this.js.publish(subject, payload);
		console.log(`[NATS] Published notification to ${subject}`);
	}
}

export default NatsPublisher;