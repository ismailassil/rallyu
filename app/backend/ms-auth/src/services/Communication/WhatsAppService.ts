import pino, { BaseLogger } from 'pino';
import { ServiceUnavailableError } from '../../types/exceptions/AAuthError';
import qrcodeTerminal from 'qrcode-terminal';
import makeWASocket, { WASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { FastifyBaseLogger } from 'fastify';
import { rmSync } from 'fs';
import path from 'path';

export interface WhatsAppServiceOptions {
	authDir?: string;
	adminJid?: string;
	logger?: BaseLogger;
}

export class WhatsAppService {
	private logger: BaseLogger;
	private authDir: string;
	private adminJid: string | undefined;
	private socket: WASocket | null = null;
	public isReady = false;

	constructor(options: WhatsAppServiceOptions = {}) {
		this.authDir = options.authDir || 'wp-session';
		this.adminJid = options.adminJid;
		this.logger = options.logger || pino({ transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } } });

	  	// non-blocking
	  	this.initializeInBackground();
	}

	private async initializeInBackground() {
		await this.createSocket();
	}

	private async createSocket() {
		this.logger.info('[WHATSAPP] Creating a new socket...');
		if (this.isReady) {
			this.logger.info('[WHATSAPP] Socket is already initialized...');
			return ;
		}

		try {
			const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

			this.socket = makeWASocket({
				auth: state,
				version: [2, 3000, 1025190524],
				logger: pino({ level: 'silent' })
			});

			const credsUpdateHandler = saveCreds;
			const connectionUpdateHandler = (update: any) => {
				const { connection, lastDisconnect, qr } = update;

				if (qr) {
					this.logger.info('[WHATSAPP] QR Code ready. Scan to authenticate.');
					qrcodeTerminal.generate(qr, { small: true });
				}

				if (connection === 'close') {
					this.isReady = false;

					const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
					const isLogout = statusCode === DisconnectReason.loggedOut;

					if (!isLogout) {
						this.logger.warn('[WHATSAPP] Connection lost. Attempting to reconnect...');
						this.createSocket();
					}
					else {
						try {
							rmSync(path.resolve(this.authDir), { recursive: true, force: true });
							this.logger.info('[WHATSAPP] Removed session files successfully...');
						} catch (err) {
							this.logger.error({ err }, '[WHATSAPP] Failed to remove session files...');
						}
						this.createSocket();
					}
				} else if (connection === 'open') {
					this.isReady = true;
					this.logger.info('[WHATSAPP] Service is up and running...');
					this.sendReadyNotification().catch(() => {
						/* im ignoring this */
					});
				}
			}

			this.socket.ev.on('connection.update', connectionUpdateHandler);
       		this.socket.ev.on('creds.update', credsUpdateHandler);
		} catch (err) {
			this.logger.error({ err }, '[WHATSAPP] Failed to create socket');
		}
	}

	private async sendReadyNotification() : Promise<void> {
		if (!this.adminJid || !this.socket || !this.isReady)
			return;

		try {
			await this.socket.sendMessage(this.adminJid, {
				text: '🟢 WhatsApp service is up and running!',
			});
			this.logger.info('[WHATSAPP] Successfully sent ready notification to Admin');
		} catch (err) {
		  	this.logger.warn({ err, to: this.adminJid }, '[WHATSAPP] Failed to send ready notification to Admin');
		}
	}

	public async sendMessage(to: string, message: string) : Promise<void> {
		if (!this.socket || !this.isReady)
			throw new ServiceUnavailableError('SMS service is not available at the moment');

		const jid = this.numberToJid(to);

		const exists = await this.isOnWhatsApp(to);
		if (!exists)
			return ;
			// throw new ServiceUnavailableError('Phone number is not registered on WhatsApp');

		try {
			await this.socket.sendMessage(jid, {
				text: message
			});
			this.logger.info({ to: jid }, '[WHATSAPP] Message sent!');
		} catch (err) {
			this.logger.info({ err, to }, '[WHATSAPP] Failed to send message!');
			throw new ServiceUnavailableError('Failed to send WhatsApp message');
		}
	}

	public async isOnWhatsApp(number: string) {
		if (!this.socket || !this.isReady)
			throw new ServiceUnavailableError('SMS service is not available at the moment');

		const jid = this.numberToJid(number);

		try {
			const result = await this.socket.onWhatsApp(jid);
			return Array.isArray(result) && result.length > 0 && result[0]?.exists === true;
		} catch (err) {
			this.logger.warn({ err, number }, '[WHATSAPP] Failed to check number existence');
			return false;
		}
	}

	private numberToJid(number: string) {
		const jid = number.endsWith('@s.whatsapp.net')
			? number : `${number.replace(/^\+/, '')}@s.whatsapp.net`;

		return jid;
	}
}

export default WhatsAppService;
