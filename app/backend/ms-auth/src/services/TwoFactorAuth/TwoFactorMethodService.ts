import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds, generateUUID } from './utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { AuthChallengeExpired, BadRequestError, ExpiredCodeError, InvalidCodeError, NoEmailIsAssociated, NoPhoneIsAssociated, TooManyAttemptsError, TooManyResendsError, TwoFAAlreadyEnabled, TwoFANotEnabledError, UserNotFoundError } from '../../types/auth.types';
import { mailingConfig } from '../../config/mailing';
import AuthChallengesRepository, { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import { UUID } from 'crypto';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
	maxAttempts: 3,
	maxResends: 3
}

class TwoFactorMethodService {
	private challengeRepository: AuthChallengesRepository;

	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {
		this.challengeRepository = new AuthChallengesRepository();
	}

	async getEnabledMethods(userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		return (await this.twoFactorRepository.findEnabledMethodsByUserID(userID)).map(m => m.method);
	}

	private async createEnabled(method: 'TOTP' | 'SMS' | 'EMAIL', totp_secret: string | null, userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAlreadyEnabled = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (isAlreadyEnabled)
			throw new TwoFAAlreadyEnabled(method);

		await this.twoFactorRepository.createEnabledMethod(
			method,
			totp_secret,
			userID
		);

		return ;
	}

	async createPending(method: AuthChallengeMethod, userID: number) {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isMethodEnabled = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (isMethodEnabled)
			throw new TwoFAAlreadyEnabled(method);

		// CLEANUP PENDING
		await this.challengeRepository.cleanupPendingByUserID(
			userID,
			'2fa_setup'
		);

		const TARGET = method === 'EMAIL' ? targetUser.email : method === 'SMS' ? targetUser.phone : null;
		const METHOD = method;
		const OTP = method === 'TOTP' ? await generateTOTPSecrets() : generateOTP();
		const TOKEN = generateUUID();
		const USER_ID = targetUser.id;
		const CHALL_TYPE = '2fa_setup';
		const EXP = nowPlusSeconds(twoFAConfig.pendingExpirySeconds);

		await this.challengeRepository.create(
			CHALL_TYPE,
			METHOD,
			TOKEN,
			TARGET,
			method === 'TOTP' ? (OTP as { secret_base32: string, secret_qrcode_url: string }).secret_base32 : OTP as string,
			EXP,
			USER_ID
		);

		await this.notifyUser(targetUser, method, OTP as string);

		return {
			token: TOKEN,
			secrets: method === 'TOTP' ? OTP : undefined
		};
	}

	async enablePending(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
			'2fa_setup'
		);

		if (!targetChall)
			throw new ExpiredCodeError();

		if (nowInSeconds() > targetChall.expires_at) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'EXPIRED'
			});
			throw new ExpiredCodeError();
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

		// MARK THE METHOD (EMAIL/SMS) AS VERIFIED
		if (targetChall.method === 'EMAIL') await this.userService.updateUser(targetChall.user_id, { email_verified: true });
		else if (targetChall.method === 'SMS') await this.userService.updateUser(targetChall.user_id, { phone_verified: true });

		await this.challengeRepository.update(targetChall.id, {
			status: 'VERIFIED'
		});

		await this.createEnabled(
			targetChall.method!,
			targetChall.secret,
			targetChall.user_id
		);

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});

		return ;
	}

	async resendChallenge(token: UUID) {
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

	async disableEnabled(method: AuthChallengeMethod, userID: number) {
		const enabledMethod = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (!enabledMethod)
			throw new TwoFANotEnabledError(method);

		await this.twoFactorRepository.deleteEnabledMethodByID(enabledMethod.id);

		return ;
	}

	private async notifyUser(targetUser: any, method: AuthChallengeMethod, OTP: string | { secret_base32: string, secret_qrcode_url: string }) {
		if (method === 'TOTP')
			return ;
		if (method === 'EMAIL' && !targetUser.email)
			throw new NoEmailIsAssociated();
		if (method === 'SMS' && !targetUser.phone)
			throw new NoPhoneIsAssociated();

		if (method === 'EMAIL')
			return await this.mailingService.sendEmail({
				from: mailingConfig.mailingServiceUser,
				to: targetUser.email,
				subject: 'Your 2FA Setup OTP Code',
				text: `Your 2FA Setup OTP code is: ${OTP}. It will expire in 5 minutes.`
			});
		if (method === 'SMS')
			return await this.smsService.sendMessage(
				targetUser.phone,
				`Your OTP code is: ${OTP}. It will expire in 5 minutes.`
			);
	}
}

export default TwoFactorMethodService;
