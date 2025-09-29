const nodemailer = require('nodemailer');

interface EmailOptions {
	from: string;
	to: string;
	subject: string;
	text: string;
}

interface EmailServiceConfig {
	mailingServiceProvider: string;
	mailingServiceUser: string;
	mailingServicePassword: string;
}

class MailingService {
	private transporter: any;

	constructor(public config: EmailServiceConfig) {
		this.transporter = nodemailer.createTransport({
			service: config.mailingServiceProvider,
			auth: {
				user: config.mailingServiceUser,
				pass: config.mailingServicePassword
			},
		});

		this.sendReadyNotification();
	}

	private async sendReadyNotification() {
		const ADMIN_EMAIL = `nabilos.fb@gmail.com`;
		const READY_SUB = 'RALLYU Notification!';
		const READY_MSG = '🟢 Mailing service is up and running!';

		await this.transporter.sendMail({
			from: this.config.mailingServiceUser,
			to: ADMIN_EMAIL,
			subject: READY_SUB,
			text: READY_MSG
		});
	}

	async sendEmail(emailOptions: EmailOptions): Promise<void> {
		return await this.transporter.sendMail(emailOptions);
	}
}

export default MailingService;