import fs from 'fs';
import pino from 'pino';
import { ServiceUnavailableError } from '../../types/exceptions/AAuthError';
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
		const baileys = await import ('@whiskeysockets/baileys');

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
			version: [2, 3000, 1025190524],
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
			this.logger.info('[SMS] Scan QRCode: ');
			qrcodeinterminal.generate(qr, { small: true });
		}

		if (connection === 'close') {
			const disconnectReason = (lastDisconnect.error)?.output?.statusCode;

			if (disconnectReason !== this.DisconnectReason.loggedOut) {
				this.logger.warn('[SMS] Connection closed, reconnecting...');
				await this.initWhatsappConnection();
			} else {
				this.logger.warn('[SMS] Connection logged out. QR Code scan is required...');
			}
		} else if (connection === 'open') {
			this.logger.info('[SMS] Service is up and running');
			await this.sendReadyNotification();
		}
	}

	private async sendReadyNotification() : Promise<void> {
		if (!this.WASocket || !this.isReady) {
			this.logger.error('[SMS] Service is not running yet!');
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
			this.logger.info('[SMS] Sent ready notification to Admin via WhatsApp');
		} catch (err) {
			this.logger.error({ err }, '[SMS] Failed to send ready notification to Admin via WhatsApp');
		}
	}

	async sendMessage(receiverWANumber: string, message: string) {
		if (!this.WASocket || !this.isReady) {
			this.logger.error('[SMS] Service is not running yet!');
			throw new ServiceUnavailableError('SMS service is not available at the moment');
		}

		const sanitizedNumber = receiverWANumber.startsWith('+')
			? receiverWANumber.slice(1)
			: receiverWANumber;

		const jid = `${sanitizedNumber}@s.whatsapp.net`;

		this.logger.info({ jid }, '[SMS] Sending WhatsApp message');

		try {
			await this.WASocket.sendMessage(jid, { text: message });
		} catch (err) {
			this.logger.error('[SMS] WhatsApp service error!', err);
			throw new ServiceUnavailableError('SMS service is not available at the moment');
		}

		this.logger.info({ jid }, '[SMS] WhatsApp message sent');
	}
}

export default WhatsAppService;
