import fs from 'fs';
import pino from 'pino';
const qrcodeinterminal = require('qrcode-terminal');

class WhatsAppService {
	private logger: any;
	private authDir: string;
	private WASocket: any;
	private state: any;
	private saveCreds: any;
	private DisconnectReason: any;
	public isReady: Promise<void>;

	constructor(logger: any, authDir?: string) {
		this.logger = logger;
		this.authDir = authDir || 'auth_info_baileys';
		this.WASocket = null;
		this.state = null;
		this.saveCreds = null;

		this.isReady = this.initWhatsappConnection();
	}

	private async initWhatsappConnection() {
		const baileys = await import ('baileys');

		const baileysLogger = pino({
			level: 'warn',
			transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:standard',
				ignore: 'pid,hostname'
			}
		}});

		const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = baileys;
		this.DisconnectReason = DisconnectReason;

		const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
		this.state = state;
		this.saveCreds = saveCreds;

		this.WASocket = makeWASocket({
			auth: this.state,
			logger: baileysLogger
		});

		return new Promise<void>((resolve, reject) => {
			this.WASocket.ev.on('connection.update', async (update: any) => {
				await this.handleConnectionUpdate(update);
				if (update.connection === 'open')
					resolve();
			});
			this.WASocket.ev.on('creds.update', saveCreds);
		});
	}

	async handleConnectionUpdate(update: any) {
		const { connection, lastDisconnect, qr } = update;

		if (qr) {
			// console.log('📱 Scan QRCode:');
			this.logger.info('[SMS] Scan QRCode:');
			qrcodeinterminal.generate(qr, { small: true });
		}

		if (connection === 'close') {
			const disconnectReason = (lastDisconnect.error)?.output?.statusCode;

			if (disconnectReason === this.DisconnectReason.restartRequired) {
				// console.log('🔄 Connection to WASocket restarted!');
				this.logger.warn('[SMS] WhatsApp connection restarted, reconnecting...');
				await this.initWhatsappConnection();
				return ;
			}

			// console.log('❌ Connection to WASocket closed due to: ', lastDisconnect.error);
			// this.logger.error({ err: lastDisconnect.error }, '[SMS] Connection to WASocket closed');

			// if (disconnectReason !== this.DisconnectReason.loggedOut) {
			// 	// console.log('🔄 Reconnecting to WASocket...');
			// 	this.logger.warn('[SMS] Reconnecting to WhatsApp...');
			// 	await this.initWhatsappConnection();
			// } else {
			// 	// console.log('❌ Logged out. QR scan required.');
			// 	this.logger.error('[SMS] WhatsApp Logged out.');
			// }
		} else if (connection === 'open') {
			// console.log('✅ Connected to WASocket!');
			this.logger.info('[SMS] WhatsApp service is up and running');
			await this.sendReadyNotification();
		}
	}

	private async sendReadyNotification() : Promise<void> {
		if (!this.WASocket || !this.isReady) {
			// console.log('❌ WASocket is not initialized yet!');
			this.logger.error('WASocket is not initialized yet!');
			return ;
		}

		const ADMIN_JID = `${212636299820}@s.whatsapp.net`;
		const READY_MSG = '🟢 WhatsApp service is up and running!';
		const READY_IMG = './uploads/avatars/aibn_che.png';

		try {
			if (!fs.existsSync(READY_IMG))
				await this.WASocket.sendMessage(ADMIN_JID, { text: READY_MSG });
			else {
				const img = fs.readFileSync(READY_IMG);
				await this.WASocket.sendMessage(ADMIN_JID, {
					image: img,
					caption: READY_MSG
				});
			}
			// console.log('✅ Sent ready notification to ADMIN');
			this.logger.info('[SMS] Sent ready notification to Admin via WhatsApp');
		} catch (err) {
			// console.log('⚠️ Failed to send ready notification:', err);
			this.logger.error({ err }, '[SMS] Failed to send ready notification to Admin via WhatsApp');
		}
	}

	async sendMessage(receiverWANumber: string, message: string) {
		if (!this.WASocket || !this.isReady) {
			// console.log('❌ WASocket is not initialized yet!');
			this.logger.error('[SMS] WhatsApp service is not running yet!');
			return ;
		}

		const jid = `${receiverWANumber}@s.whatsapp.net`;

		this.logger.info({ jid }, '[SMS] Sending WhatsApp message');

		await this.WASocket.sendMessage(jid, { text: message });

		this.logger.info({ jid }, '[SMS] WhatsApp message sent');
	}
}

export default WhatsAppService;