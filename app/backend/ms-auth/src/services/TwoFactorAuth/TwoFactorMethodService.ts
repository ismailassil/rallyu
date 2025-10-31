import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds, generateUUID } from '../../utils/auth/utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { mailingConfig } from '../../config/mailing';
import AuthChallengesRepository, { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import { UUID } from 'crypto';
import { UserNotFoundError } from '../../types/exceptions/user.exceptions';
import { TwoFAAlreadyEnabled, TwoFANotEnabledError } from '../../types/exceptions/twofa.exception';
import { AuthChallengeExpired, InvalidCodeError, TooManyAttemptsError } from '../../types/exceptions/verification.exceptions';
import { BadRequestError } from '../../types/exceptions/AAuthError';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
	maxAttempts: 3,
	maxResends: 3
}

class TwoFactorMethodService {
	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private challengeRepository: AuthChallengesRepository
	) {}

	async getEnabledMethods(userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		return (await this.twoFactorRepository.findEnabledMethodsByUserID(userID)).map(m => m.method);
	}

	async setupTOTP(method: AuthChallengeMethod = 'TOTP', userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isMethodEnabled = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (isMethodEnabled)
			throw new TwoFAAlreadyEnabled('TOTP');

		// CLEANUP PENDING
		await this.challengeRepository.cleanupPendingByUserID(
			userID,
			'2fa_setup'
		);

		const TOKEN = generateUUID();
		const SECRETS = await generateTOTPSecrets();
		await this.challengeRepository.create(
			'2fa_setup',
			'TOTP',
			TOKEN,
			null,
			SECRETS.secret_base32,
			nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
			userID
		);

		return {
			token: TOKEN,
			secrets: SECRETS
		};
	}

	async enableTOTP(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
			'2fa_setup'
		);

		if (!targetChall)
			throw new AuthChallengeExpired();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new AuthChallengeExpired();
		}

		if (!verifyTOTP(targetChall.secret!, code)) {
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
			status: 'VERIFIED'
		});

		await this.twoFactorRepository.createEnabledMethod(
			targetChall.method!,
			targetChall.secret,
			targetChall.user_id
		);

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});

		return ;
	}

	async enable(method: AuthChallengeMethod, userID: number) {
		if (method === 'TOTP')
			throw new BadRequestError('Enabling TOTP is not supported');

		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAlreadyEnabled = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (isAlreadyEnabled)
			throw new TwoFAAlreadyEnabled(method);

		const isContactVerified = method === 'EMAIL' ? targetUser.email_verified : targetUser.phone_verified;
		if (!isContactVerified)
			throw new BadRequestError('You must verify contact method before enabling 2FA');

		await this.twoFactorRepository.createEnabledMethod(
			method,
			null,
			userID
		);
	}

	async disableEnabled(method: AuthChallengeMethod, userID: number) {
		const enabledMethod = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (!enabledMethod)
			throw new TwoFANotEnabledError(method);

		await this.twoFactorRepository.deleteEnabledMethodByID(enabledMethod.id);

		return ;
	}
}

export default TwoFactorMethodService;
