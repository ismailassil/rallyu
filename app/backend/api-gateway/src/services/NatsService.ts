import type {
	Consumer,
	JetStreamClient,
	JetStreamManager,
	JsMsg,
	NatsConnection,
} from 'nats';
import {
	AckPolicy,
	connect,
	DeliverPolicy,
	JSONCodec,
	nanos,
	StringCodec,
} from 'nats';
import type { NatsPluginOpts } from '@/plugin/nats/nats.types.js';
import chalk from 'chalk';
import type { FastifyInstance } from 'fastify';
import { handleNotify } from '../handlers/notify.js';
import { handleUpdateNotifAction } from '../handlers/update_action.js';
import handleChatMsg from '../handlers/chat_events.js';
import { handleUpdateNotifOnType } from '../handlers/update_on_type.js';

class NatsService {
	private nc!: NatsConnection;
	private natsManager!: JetStreamManager;
	private jetstream!: JetStreamClient;
	private readonly options: NatsPluginOpts;
	private readonly fastify: FastifyInstance;
	private readonly jsCodec = JSONCodec();
	private readonly sCodec = StringCodec();
	private consumer!: Consumer;
	private readonly consumers = [
		{
			serviceName: 'chat',
			streamName: 'chatStream',
			consumerName: 'chatConsumer',
			subject: 'chat.*',
		},
		{
			serviceName: 'notification',
			streamName: 'notificationStream',
			consumerName: 'notificationConsumer',
			subject: 'notification.*',
		},
		{
			serviceName: 'gateway',
			streamName: 'gatewayStream',
			consumerName: 'gatewayConsumer',
			subject: 'gateway.>',
		},
	] as const;

	constructor(fastify: FastifyInstance, opts: NatsPluginOpts) {
		this.options = opts;
		this.fastify = fastify;
	}

	async connect(): Promise<void> {
		const { NATS_URL, NATS_USER, NATS_PASSWORD } = this.options;

		this.nc = await connect({
			servers: NATS_URL || 'nats://localhost:4222',
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: 'Gateway',
		});

		this.fastify.log.info(
			`[NATS] Server Connection Established ['${this.nc.getServer()}']`,
		);

		await this.setupJetStream();
		await this.createConsumers();
		this.setupJetStreamClient();
		this.subscribeGatewayStream();
	}

	private async setupJetStream() {
		this.natsManager = await this.nc.jetstreamManager();

		for (const stream of this.consumers) {
			try {
				await this.natsManager.streams.info(stream.streamName);
				this.fastify.log.warn(
					`[NATS] Stream: <${chalk.yellow(
						stream.streamName,
					)}> already Created`,
				);
			} catch (error) {
				this.fastify.log.error('[NATS] ' + (error as Error).message);
				await this.natsManager.streams.add({
					name: stream.streamName,
					subjects: [stream.subject],
					max_age: nanos(1.8e6), // 30min
					description: '[NATS] Stream for CHAT MS binded with SocketIO',
				});
				this.fastify.log.info(
					`[NATS] Stream <${chalk.yellow(
						stream.streamName,
					)}> has been created successfully`,
				);
			}
		}
	}

	private async createConsumers() {
		for (const cons of this.consumers) {
			try {
				const consInfo = await this.natsManager.consumers.info(
					cons.streamName,
					cons.consumerName,
				);
				this.fastify.log.warn(
					`[NATS] Consumer <${chalk.yellow(
						consInfo.name,
					)}> already Created`,
				);
			} catch (error) {
				this.fastify.log.error((error as Error).message);
				const consInfo = await this.natsManager.consumers.add(
					cons.streamName,
					{
						durable_name: cons.consumerName,
						ack_policy: AckPolicy.Explicit,
						deliver_policy: DeliverPolicy.All,
					},
				);
				this.fastify.log.info(
					`[NATS] Consumer <${chalk.yellow(
						consInfo.name,
					)}> has been created successfully`,
				);
			}
		}
	}

	private setupJetStreamClient() {
		this.jetstream = this.nc.jetstream();
	}

	public setupDecorators() {
		this.fastify.decorate('nc', this.nc);
		this.fastify.decorate('js', this.jetstream);
		this.fastify.decorate('jsCodec', this.jsCodec);
		this.fastify.decorate('scCodec', this.sCodec);
	}

	private async handleNotifications(m: JsMsg) {
		if (m.subject.includes('notify')) {
			await handleNotify(m);
		} else if (m.subject.includes('update_action')) {
			await handleUpdateNotifAction(m);
		} else if (m.subject.includes("update_on_type")) {
			await handleUpdateNotifOnType(m);
		}
	}

	private async subscribeGatewayStream() {
		this.consumer = await this.jetstream.consumers.get(
			'gatewayStream',
			'gatewayConsumer',
		);

		const iter = await this.consumer.consume();

		for await (const m of iter) {
			this.fastify.log.info('SOMEONE SENT A MSG TO GATEWAY');
			this.fastify.log.info(m.subject);
			if (m.subject.includes('chat')) {
				handleChatMsg(m);
			} else if (m.subject.includes('notification')) {
				this.handleNotifications(m);
			}
			m.ack();
		}
	}

	async close() {
		if (!this.nc.isClosed() && !this.nc.isDraining()) {
			await this.nc.drain();
		}
		await this.nc.close();
		this.fastify.log.info('[NATS] Server Closed Successfully');
	}
}

export default NatsService;
