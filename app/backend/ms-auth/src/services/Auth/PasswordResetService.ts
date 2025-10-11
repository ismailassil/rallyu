import ResetPasswordRepository from "../../repositories/ResetPasswordRepository";
import bcrypt from 'bcrypt';
import { ExpiredCodeError, InvalidCodeError, InvalidCredentialsError, NoEmailIsAssociated, PasswordResetExpiredError, PasswordResetInvalidCodeError, PasswordResetNotFoundError, UserNotFoundError } from "../../types/auth.types";
import MailingService from "../Communication/MailingService";
import WhatsAppService from "../Communication/WhatsAppService";
import { AuthConfig } from "../../config/auth";
import UserService from "../User/UserService";
import { generateOTP, generateUUID, nowInSeconds, nowPlusSeconds, verifyOTP } from "../TwoFactorAuth/utils";
import AuthChallengesRepository from "../../repositories/AuthChallengesRepository";
import { UUID } from "crypto";

const passwordResetConfig = {
	codeExpirySeconds: 5 * 60 // 5 minutes
}

class PasswordResetService {
	private challengeRepository: AuthChallengesRepository;

	constructor(
		private authConfig: AuthConfig,
		private userService: UserService,
		private resetRepository: ResetPasswordRepository,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {
		this.challengeRepository = new AuthChallengesRepository();
	}

	async setup(email: string) {
		const targetUser = await this.userService.getUserByEmail(email);
		if (!targetUser || !targetUser.email)
			throw new NoEmailIsAssociated();

		// CLEANUP PENDING
		await this.challengeRepository.cleanupPendingByUserID(
			targetUser.id, 
			'password_reset'
		);
		
		const TARGET = email;
		const METHOD = 'EMAIL';
		const OTP = generateOTP();
		const TOKEN = generateUUID();
		const USER_ID = targetUser.id;
		const CHALL_TYPE = 'password_reset';
		const EXP = nowPlusSeconds(passwordResetConfig.codeExpirySeconds);

		
		await this.challengeRepository.create(
			CHALL_TYPE,
			METHOD,
			TOKEN,
			TARGET,
			OTP,
			EXP,
			USER_ID
		);

		await this.notifyUser(targetUser, OTP);

		return TOKEN;
	}

	async verify(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token, 
			'PENDING', 
			'password_reset', 
			'EMAIL'
		);

		if (!targetChall)
			throw new ExpiredCodeError();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new ExpiredCodeError();
		}

		// TODO: ADD RATE LIMIT

		if (!verifyOTP(targetChall.secret!, code)) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'FAILED'
			});
			throw new InvalidCodeError();
		}

		// TODO: CHECK THE NEED OF THIS
		// if (targetChall.status !== 'PENDING')
		// 	throw new ExpiredCodeError();

		await this.challengeRepository.update(targetChall.id, {
			status: 'VERIFIED'
		});
	}

	async update(token: UUID, newPassword: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token, 
			'VERIFIED', 
			'password_reset', 
			'EMAIL'
		);

		if (!targetChall)
			throw new ExpiredCodeError();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new ExpiredCodeError();
		}

		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(targetChall.user_id,{
			password: newHashedPassword
		});

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});
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