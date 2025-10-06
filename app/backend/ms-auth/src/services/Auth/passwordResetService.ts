import ResetPasswordRepository from "../../repositories/ResetPasswordRepository";
import bcrypt from 'bcrypt';
import { InvalidCredentialsError, NoEmailIsAssociated, PasswordResetExpiredError, PasswordResetInvalidCodeError, PasswordResetNotFoundError, UserNotFoundError } from "../../types/auth.types";
import MailingService from "../Communication/MailingService";
import WhatsAppService from "../Communication/WhatsAppService";
import { AuthConfig } from "../../config/auth";
import UserService from "../User/userService";
import { generateOTP, nowInSeconds, nowPlusSeconds } from "../TwoFactorAuth/utils";

const passwordResetConfig = {
	codeExpirySeconds: 5 * 60 // 5 minutes
}

class PasswordResetService {
	constructor(
		private authConfig: AuthConfig,
		private userService: UserService,
		private resetRepository: ResetPasswordRepository,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	async setup(email: string) {
		let targetUser = null;

		try {
			targetUser = await this.userService.getUserByEmail(email);
		} catch (err) {
			throw new NoEmailIsAssociated();
		}

		if (!targetUser || !targetUser.email)
			throw new NoEmailIsAssociated();

		await this.resetRepository.deleteAllByUserID(targetUser.id);

		const OTP = generateOTP();

		await this.resetRepository.create(
			targetUser.id, 
			OTP, 
			nowPlusSeconds(passwordResetConfig.codeExpirySeconds)
		);

		await this.notifyUser(targetUser, OTP);
	}

	async verify(email: string, code: string) {
		let targetUser = null;

		try {
			targetUser = await this.userService.getUserByEmail(email);
		} catch (err) {
			throw new NoEmailIsAssociated();
		}

		if (!targetUser)
			throw new NoEmailIsAssociated();

		const resetPasswordRow = await this.resetRepository.findByUserID(targetUser.id);
		if (!resetPasswordRow)
			throw new PasswordResetNotFoundError();
		if (nowInSeconds() > resetPasswordRow.expires_at)
			throw new PasswordResetExpiredError();
		if (code !== resetPasswordRow.code)
			throw new PasswordResetInvalidCodeError();
	}

	async update(email: string, code: string, newPassword: string) {
		let targetUser = null;

		try {
			targetUser = await this.userService.getUserByEmail(email);
		} catch (err) {
			throw new NoEmailIsAssociated();
		}
		
		if (!targetUser)
			throw new NoEmailIsAssociated();

		const resetPasswordRow = await this.resetRepository.findByUserID(targetUser.id);
		if (!resetPasswordRow)
			throw new PasswordResetNotFoundError();
		if (nowInSeconds() > resetPasswordRow.expires_at)
			throw new PasswordResetExpiredError();
		if (code !== resetPasswordRow.code)
			throw new PasswordResetInvalidCodeError();

		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(targetUser.id, { password: newHashedPassword });

		await this.resetRepository.deleteAllByUserID(targetUser.id);
	}

	private async notifyUser(targetUser: any, OTP: string) {
		if (!targetUser.email)
			throw new NoEmailIsAssociated();

		await this.mailingService.sendEmail({
			from: this.mailingService.config.mailingServiceUser,
			to: targetUser.email,
			subject: 'Password Reset Code',
			text: `Your password reset code is: ${OTP}`
		});
	}
}

export default PasswordResetService;