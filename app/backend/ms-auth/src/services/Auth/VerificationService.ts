import { UUID } from "crypto";
import AuthChallengesRepository, { AuthChallenge, AuthChallengeMethod } from "../../repositories/AuthChallengesRepository";
import UserService from "../User/UserService";
import { generateOTP, generateUUID, nowInSeconds, nowPlusSeconds, verifyOTP } from "../../utils/auth/utils";
import MailingService from "../Communication/MailingService";
import WhatsAppService from "../Communication/WhatsAppService";
import { mailingConfig } from "../../config/mailing";
import { UserAlreadyExistsError, UserNotFoundError } from "../../types/exceptions/user.exceptions";
import { AuthChallengeExpired, InvalidCodeError, TooManyAttemptsError, TooManyResendsError } from "../../types/exceptions/verification.exceptions";

const verificationConfig = {
	expirySeconds: 5 * 60,
	maxAttempts: 3,
	maxResends: 3
}

class VerificationService {
	constructor(
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService,
		private challengeRepository: AuthChallengesRepository
	) {}

	async request(_for: 'email' | 'phone', userID: number, providedTarget: string) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();
		if (_for === 'email') {
			const emailUser = await this.userService.getUserByEmail(providedTarget);
			if (emailUser && emailUser.id !== userID) throw new UserAlreadyExistsError('Email');
		}
		// else if (_for === 'phone') {
		// 	const phoneUser = await this.userService.getUserByPhone(providedTarget);
		// 	if (phoneUser && phoneUser.id !== userID) throw new UserAlreadyExistsError('Phone');
		// }

		// CLEANUP PENDING
		await this.challengeRepository.cleanupPendingByUserID(
			userID,
			_for === 'email' ? 'email_verification' : 'phone_verification'
		);

		const TARGET = providedTarget;
		const METHOD = _for === 'email' ? 'EMAIL' : 'SMS';
		const OTP = generateOTP();
		const TOKEN = generateUUID();
		const USER_ID = userID;
		const CHALL_TYPE = _for === 'email' ? 'email_verification' : 'phone_verification';
		const EXP = nowPlusSeconds(verificationConfig.expirySeconds);

		// CREATE CHALL
		await this.challengeRepository.create(
			CHALL_TYPE,
			METHOD,
			TOKEN,
			TARGET,
			OTP,
			EXP,
			USER_ID
		);

		await this.notifyUser(TARGET, METHOD, OTP);

		return TOKEN;
	}

	async verify(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
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
				...(totalAttempts >= verificationConfig.maxAttempts && { status: 'FAILED' })
			});
			if (totalAttempts >= verificationConfig.maxAttempts)
				throw new TooManyAttemptsError();
			throw new InvalidCodeError();
		}

		if (targetChall.challenge_type === 'email_verification') {
			await this.userService.updateUser(targetChall.user_id, {
				email: targetChall.target
			});
			await this.userService.updateUser(targetChall.user_id, {
				email_verified: true
			});
		}
		else if (targetChall.challenge_type === 'phone_verification') {
			await this.userService.updateUser(targetChall.user_id, {
				phone: targetChall.target
			});
			await this.userService.updateUser(targetChall.user_id, {
				phone_verified: true
			});
		}

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});

		return targetChall.user_id;
	}

	async resend(token: UUID) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		if (targetChall.resend_attempts >= verificationConfig.maxResends) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'FAILED'
			});
			throw new TooManyResendsError();
		}

		const targetUser = await this.userService.getUserById(targetChall.user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		const newOTP = generateOTP();
		const newEXP = nowPlusSeconds(verificationConfig.expirySeconds);

		await this.challengeRepository.update(targetChall.id, {
			secret: newOTP,
			expires_at: newEXP,
			resend_attempts: targetChall.resend_attempts + 1
		});

		await this.notifyUser(targetChall.target!, targetChall.method!, newOTP);
	}

	async unverify(_for: 'email' | 'phone', userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userService.updateUser(userID, _for === 'email' ? { email_verified: false } : _for === 'phone' ? { phone_verified: false } : {});
	}

	private async notifyUser(target: string, method: AuthChallengeMethod, OTP: string) {
		if (!target)
			return ;

		if (method === 'EMAIL')
			return await this.mailingService.sendEmail({
				from: mailingConfig.mailingServiceUser,
				to: target,
				subject: 'Your Email Verification OTP Code',
				text: `Your Email Verification OTP code is: ${OTP}. It will expire in 5 minutes.`
			});
		if (method === 'SMS')
			return await this.smsService.sendMessage(
				target,
				`Your Phone Verification OTP code is: ${OTP}. It will expire in 5 minutes.`
			);
	}
}

export default VerificationService;
