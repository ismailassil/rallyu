import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds, generateUUID } from './utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { mailingConfig } from '../../config/mailing';
import AuthChallengesRepository, { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import { UUID } from 'crypto';
import { UserNotFoundError } from '../../types/exceptions/user.exceptions';
import { TwoFANotEnabledError } from '../../types/exceptions/twofa.exception';
import { AuthChallengeExpired, InvalidCodeError, TooManyAttemptsError, TooManyResendsError } from '../../types/exceptions/verification.exceptions';
import { BadRequestError } from '../../types/exceptions/AAuthError';
import logger from '../../utils/misc/logger';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
	maxAttempts: 3,
	maxResends: 3
}

class TwoFactorChallengeService {
	private challengeRepository: AuthChallengesRepository;

	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {
		this.challengeRepository = new AuthChallengesRepository();
	}

	// async getChallengeByID(challengeID: number) {
	// 	const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
	// 	if (!targetChallenge)
	// 		throw new TwoFAChallengeNotFound();

	// 	return targetChallenge;
	// }

	async getChallengeByToken(token: UUID) {
		return await this.challengeRepository.findByToken(token);
	}

	async createChallenge(userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		// CLEANUP PENDING
		await this.challengeRepository.cleanupPendingByUserID(
			targetUser.id,
			'2fa_login'
		);

		const enabledMethods = await this.twoFactorRepository.findEnabledMethodsByUserID(userID);
		if (enabledMethods.length === 0)
			throw new TwoFANotEnabledError();

		const TARGET = null;
		const METHOD = null;
		const OTP = null;
		const TOKEN = generateUUID();
		const USER_ID = targetUser.id;
		const CHALL_TYPE = '2fa_login';
		const EXP = nowPlusSeconds(twoFAConfig.pendingExpirySeconds);

		await this.challengeRepository.create(
			CHALL_TYPE,
			METHOD,
			TOKEN,
			TARGET,
			OTP,
			EXP,
			USER_ID
		);

		return TOKEN;
	}

	async selectMethod(token: UUID, method: AuthChallengeMethod) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
			'2fa_login'
		) || await this.challengeRepository.findByQuery(
			token,
			'VERIFIED',
			'2fa_login'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		const isMethodEnabled = await this.twoFactorRepository.findEnabledMethodByType(
			targetChall.user_id,
			method
		);

		if (!isMethodEnabled)
			throw new TwoFANotEnabledError();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		// TODO: ADD RATE LIMIT
		// TODO: ADD EXP ++

		const OTPCodeOrTOTPSecret = method === 'TOTP' ? isMethodEnabled.totp_secret! : generateOTP();
		const targetUser = await this.userService.getUserById(targetChall.user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.challengeRepository.update(targetChall.id, {
			method: method,
			target: method === 'EMAIL' ? targetUser.email : method === 'SMS' ? targetUser.phone : null,
			secret: OTPCodeOrTOTPSecret,
			status: 'VERIFIED'
		});

		await this.notifyUser(targetUser, method, OTPCodeOrTOTPSecret);
	}

	async verifyChallenge(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'VERIFIED',
			'2fa_login'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		const verifyFunc = targetChall.method === 'TOTP'
			? () => verifyTOTP(targetChall.secret!, code)
			: () => verifyOTP(targetChall.secret!, code);
		if (!verifyFunc()) {
			const totalAttempts = targetChall.verify_attempts + 1;
			await this.challengeRepository.update(targetChall.id, {
				verify_attempts: totalAttempts,
				...(totalAttempts >= twoFAConfig.maxAttempts && { status: 'FAILED' })
			});
			if (totalAttempts >= twoFAConfig.maxAttempts)
				throw new TooManyAttemptsError();
			throw new InvalidCodeError();
		}

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});
	}

	async resendChallenge(token: UUID) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'VERIFIED',
			'2fa_login'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		if (targetChall.method === 'TOTP')
			throw new BadRequestError('Resend not supported for TOTP');

		if (targetChall.resend_attempts >= twoFAConfig.maxResends) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'FAILED'
			});
			throw new TooManyResendsError();
		}

		const newOTP = generateOTP();
		const newEXP = nowPlusSeconds(twoFAConfig.pendingExpirySeconds);

		await this.challengeRepository.update(targetChall.id, {
			secret: newOTP,
			expires_at: newEXP,
			resend_attempts: targetChall.resend_attempts + 1
		});

		const targetUser = await this.userService.getUserById(targetChall.user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.notifyUser(targetUser, targetChall.method!, newOTP);
	}

	private async notifyUser(targetUser: any, method: AuthChallengeMethod, OTP: string | { secret_base32: string, secret_qrcode_url: string }) {
		if (method === 'TOTP')
			return ;
		if (method === 'EMAIL' && !targetUser.email) {
			logger.error({ method, targetUser, targetEmail: targetUser.email }, '[NOTIFY] TwoFactorChallengeService: targetEmail is null -- This should never happen');
			return ;
		}
		if (method === 'SMS' && !targetUser.phone) {
			logger.error({ method, targetUser, targetPhone: targetUser.phone }, '[NOTIFY] TwoFactorChallengeService: targetPhone is null -- This should never happen');
			return ;
		}

		if (method === 'EMAIL')
			return await this.mailingService.sendEmail({
				from: mailingConfig.mailingServiceUser,
				to: targetUser.email,
				subject: 'Your 2FA OTP Code',
				text: `Your 2FA OTP code is: ${OTP}. It will expire in 5 minutes.`
			});
		if (method === 'SMS')
			return await this.smsService.sendMessage(
				targetUser.phone,
				`Your 2FA OTP code is: ${OTP}. It will expire in 5 minutes.`
			);
	}
}

export default TwoFactorChallengeService;
