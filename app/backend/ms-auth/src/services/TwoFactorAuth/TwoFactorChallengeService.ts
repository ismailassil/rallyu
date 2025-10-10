import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds, generateUUID } from './utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { ExpiredCodeError, InvalidCodeError, NoEmailIsAssociated, NoPhoneIsAssociated, TwoFAChallengeExpired, TwoFAChallengeInvalidCode, TwoFAChallengeMaxAttemptsReached, TwoFAChallengeMaxResendsReached, TwoFAChallengeMethodNotSelected, TwoFAChallengeNotFound, TwoFANotEnabledError, UserNotFoundError, _2FANotEnabled, _2FANotFound } from '../../types/auth.types';
import { mailingConfig } from '../../config/mailing';
import AuthChallengesRepository, { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import { UUID } from 'crypto';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
	maxAttempts: 5,
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

		// const challengeID = await this.twoFactorRepository.createPendingLoginSession(
		// 	null,
		// 	null,
		// 	twoFAConfig.maxAttempts,
		// 	twoFAConfig.maxResends,
		// 	nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
		// 	userID
		// );

		return TOKEN;
	}

	async selectMethod(token: UUID, method: AuthChallengeMethod) {
		let targetChall = await this.challengeRepository.findByQuery(
			token,
			'PENDING',
			'2fa_login'
		) || await this.challengeRepository.findByQuery(
			token,
			'VERIFIED',
			'2fa_login'
		);

		if (!targetChall)
			throw new TwoFAChallengeExpired();

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
			throw new TwoFAChallengeExpired();
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

		// const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
		// if (!targetChallenge)
		// 	throw new TwoFAChallengeNotFound();

		// const targetUser = await this.userService.getUserById(targetChallenge.user_id);
		// if (!targetUser)
		// 	throw new UserNotFoundError();

		// const isEnabled = await this.twoFactorRepository.findEnabledMethodByType(targetChallenge.user_id, method);
		// if (!isEnabled)
		// 	throw new _2FANotEnabled(method);

		// if (targetChallenge.expires_at < nowInSeconds())
		// 	throw new TwoFAChallengeExpired();
		// if (targetChallenge.remaining_resends <= 0)
		// 	throw new TwoFAChallengeMaxResendsReached();

		// const OTPCodeOrTOTPSecret = method === 'TOTP' ? isEnabled.totp_secret! : generateOTP();
		// await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
		// 	method: method,
		// 	code: OTPCodeOrTOTPSecret,
		// 	remaining_resends: targetChallenge.remaining_resends - 1,
		// 	expires_at: nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
		// });

		await this.notifyUser(targetUser, method, OTPCodeOrTOTPSecret);
	}

	async verifyChallenge(token: UUID, code: string) {
		const targetChall = await this.challengeRepository.findByQuery(
			token,
			'VERIFIED',
			'2fa_login'
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

		const verifyFunc = targetChall.method === 'TOTP'
			? () => verifyTOTP(targetChall.secret!, code)
			: () => verifyOTP(targetChall.secret!, code);
		if (!verifyFunc()) {
			await this.challengeRepository.update(targetChall.id, {
				status: 'FAILED'
			});
			throw new InvalidCodeError();
		}

		await this.challengeRepository.update(targetChall.id, {
			status: 'COMPLETED'
		});


		// const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
		// if (!targetChallenge)
		// 	throw new TwoFAChallengeNotFound();

		// if (!targetChallenge.method || !targetChallenge.code)
		// 	throw new TwoFAChallengeMethodNotSelected();
		
		// const targetUser = await this.userService.getUserById(targetChallenge.user_id);
		// if (!targetUser)
		// 	throw new UserNotFoundError();

		// const isEnabled = await this.twoFactorRepository.findEnabledMethodByType(targetChallenge.user_id, targetChallenge.method);
		// if (!isEnabled)
		// 	throw new _2FANotEnabled(targetChallenge.method);

		// if (targetChallenge.expires_at < nowInSeconds())
		// 	throw new TwoFAChallengeExpired();
		// if (targetChallenge.remaining_resends <= 0)
		// 	throw new TwoFAChallengeMaxResendsReached();
		// if (targetChallenge.remaining_attempts <= 0)
		// 	throw new TwoFAChallengeMaxAttemptsReached();

		// const isValidCode = targetChallenge.method === 'TOTP' ? verifyTOTP(isEnabled.totp_secret!, code) : verifyOTP(targetChallenge.code, code);
		// if (!isValidCode) {
		// 	await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
		// 		remaining_attempts: targetChallenge.remaining_attempts - 1,
		// 	});
		// 	throw new TwoFAChallengeInvalidCode();
		// }

		// await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
		// 	remaining_attempts: 0,
		// 	remaining_resends: 0,
		// 	expires_at: nowInSeconds()
		// });

		// return isValidCode;
	}

	private async notifyUser(targetUser: any, method: 'TOTP' | 'SMS' | 'EMAIL', OTP: string | { secret_base32: string, secret_qrcode_url: string }) {
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