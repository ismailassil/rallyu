import PasswordResetRepository from "../repositories/passwordResetRepository";
import bcrypt from 'bcrypt';
import { InvalidCredentialsError, NoEmailIsAssociated, UserNotFoundError } from "../types/auth.types";
import MailingService from "./MailingService";
import WhatsAppService from "./WhatsAppService";
import { AuthConfig } from "../config/auth";
import UserService from "./userService";

class PasswordResetService {
	constructor(
		private authConfig: AuthConfig,
		private userService: UserService,
		private resetRepository: PasswordResetRepository,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	async setup(email: string) {
		const existingUser = await this.userService.getUserByEmail(email);
		if (!existingUser)
			throw new NoEmailIsAssociated();

		await this.resetRepository.deleteAllByUserID(existingUser.id);

		const OTP = this.generateOTP();

		await this.resetRepository.create(existingUser.id, OTP, this.nowPlusMinutes(5));

		await this.sendPasswordResetEmail(email, OTP);
	}

	async verify(email: string, code: string) {
		const existingUser = await this.userService.getUserByEmail(email);
		if (!existingUser)
			throw new NoEmailIsAssociated();

		const resetPasswordRow = await this.resetRepository.findByUserID(existingUser.id);
		if (!resetPasswordRow || this.nowInSeconds() > resetPasswordRow.expires_at)
			throw new Error('Reset request expired or not found');
		if (code !== resetPasswordRow.code)
			throw new Error('Invalid code');
	}

	async update(email: string, code: string, newPassword: string) {
		const existingUser = await this.userService.getUserByEmail(email);
		if (!existingUser)
			throw new NoEmailIsAssociated();

		const resetPasswordRow = await this.resetRepository.findByUserID(existingUser.id);

		// NOTE: We allow updating password even if the reset request expired
		if (!resetPasswordRow || this.nowInSeconds() > resetPasswordRow.expires_at)
			throw new Error('Reset request expired or not found');
		if (code !== resetPasswordRow.code)
			throw new Error('Invalid code');

		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(existingUser.id, { password: newHashedPassword });

		await this.resetRepository.deleteAllByUserID(existingUser.id);
	}

	private generateOTP() {
		return ('' + Math.floor(100000 + Math.random() * 90000));
	}

	private async sendPasswordResetEmail(email: string, code: string) {
		await this.mailingService.sendEmail({
			from: this.mailingService.config.mailingServiceUser,
			to: email,
			subject: 'Password Reset Code',
			text: `Your password reset code is: ${code}`
		});
	}
	
	private async sendPasswordResetSMS(phone: string, code: string) {
		await this.smsService.sendMessage(phone, `Your password reset code is: ${code}`);
	}
	
	private nowPlusMinutes(minutes: number) {
		return Math.floor((Date.now() / 1000) + minutes * 60);
	}

	private nowInSeconds() {
		return Math.floor(Date.now() / 1000);
	}
}

export default PasswordResetService;