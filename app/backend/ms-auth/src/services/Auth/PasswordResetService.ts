import ResetPasswordRepository from "../../repositories/ResetPasswordRepository";
import bcrypt from 'bcrypt';
import MailingService from "../Communication/MailingService";
import WhatsAppService from "../Communication/WhatsAppService";
import { AuthConfig } from "../../config/auth";
import UserService from "../User/UserService";
import { generateOTP, generateUUID, nowInSeconds, nowPlusSeconds, verifyOTP } from "../TwoFactorAuth/utils";
import AuthChallengesRepository from "../../repositories/AuthChallengesRepository";
import { UUID } from "crypto";
import { UserNotFoundError } from "../../types/exceptions/user.exceptions";
import { AuthChallengeExpired, InvalidCodeError, TooManyAttemptsError, TooManyResendsError } from "../../types/exceptions/verification.exceptions";
import logger from "../../utils/misc/logger";

const passwordResetConfig = {
	codeExpirySeconds: 5 * 60, // 5 minutes
	maxResends: 3,
	maxAttempts: 3
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
			throw new UserNotFoundError();

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

		await this.notifyUser(targetUser.email, OTP);

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
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		if (!verifyOTP(targetChall.secret!, code)) {
			const totalAttempts = targetChall.verify_attempts + 1;
			await this.challengeRepository.update(targetChall.id, {
				verify_attempts: totalAttempts,
				...(totalAttempts >= passwordResetConfig.maxAttempts && { status: 'FAILED' })
			});
			if (totalAttempts >= passwordResetConfig.maxAttempts)
				throw new TooManyAttemptsError();
			throw new InvalidCodeError();
		}

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
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(targetChall.user_id,{
			password: newHashedPassword
		});

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});
	}

	async resend(token: UUID) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
			'password_reset',
			'EMAIL'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		if (targetChall.resend_attempts >= passwordResetConfig.maxResends) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'FAILED'
			});
			throw new TooManyResendsError();
		}

		const targetUser = await this.userService.getUserById(targetChall.user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		const newOTP = generateOTP();
		const newEXP = nowPlusSeconds(passwordResetConfig.codeExpirySeconds);

		await this.challengeRepository.update(targetChall.id, {
			secret: newOTP,
			expires_at: newEXP,
			resend_attempts: targetChall.resend_attempts + 1
		});

		await this.notifyUser(targetUser.email, newOTP);
	}

	private async notifyUser(targetEmail: string, OTP: string) {
		if (!targetEmail) {
			logger.error({ targetEmail }, '[NOTIFY] Password Reset Service: targetEmail is null -- This should never happen');
			return ;
		}

		await this.mailingService.sendEmail({
			from: this.mailingService.config.mailingServiceUser,
			to: targetEmail,
			subject: 'Password Reset Code',
			text: `Your password reset code is: ${OTP}`
		});
	}
}

export default PasswordResetService;
