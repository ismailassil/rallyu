import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds, generateUUID } from './utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { ExpiredCodeError, InvalidCodeError, NoEmailIsAssociated, NoPhoneIsAssociated, TwoFAAlreadyEnabled, UserNotFoundError, _2FAAlreadyEnabled, _2FAExpiredCode, _2FAInvalidCode, _2FANotFound } from '../../types/auth.types';
import { mailingConfig } from '../../config/mailing';
import AuthChallengesRepository, { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import { UUID } from 'crypto';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
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
			throw new _2FAAlreadyEnabled(method);

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

		// const isPendingExists = await this.twoFactorRepository.findPendingMethodByType(userID, method);
		// if (isPendingExists)
		// 	await this.twoFactorRepository.deletePendingMethodByID(isPendingExists.id);

		// let secret = method === 'TOTP' ? await generateTOTPSecrets() : generateOTP();
		// await this.twoFactorRepository.createPendingMethod(
		// 	method, 
		// 	method === 'TOTP' ? (secret as { secret_base32: string, secret_qrcode_url: string }).secret_base32 : secret as string, 
		// 	nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
		// 	userID
		// );
		// await this.notifyUser(targetUser, method, secret as string);

		await this.notifyUser(targetUser, method, OTP as string);

		return {
			token: TOKEN,
			secrets: method === 'TOTP' ? OTP : undefined
		};
	}

	async enablePending(token: UUID, code: string) {
		// const targetUser = await this.userService.getUserById(userID);
		// if (!targetUser)
		// 	throw new UserNotFoundError();

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

		// const pendingMethod = await this.twoFactorRepository.findPendingMethodByType(userID, method);
		// if (!pendingMethod)
		// 	throw new _2FANotFound(method);
		
		// const isExpired = nowInSeconds() > pendingMethod.expires_at;
		// if (method !== 'TOTP' && isExpired)
		// 	throw new _2FAExpiredCode(method);

		// const isValid = method === 'TOTP' ? verifyTOTP(pendingMethod.temp_value, code) : verifyOTP(pendingMethod.temp_value, code);
		// if (!isValid)
		// 	throw new _2FAInvalidCode(method);

		// await this.createEnabled(method, method === 'TOTP' ? pendingMethod.temp_value : null, userID);

		return ;
	}

	async disableEnabled(method: AuthChallengeMethod, userID: number) {
		const enabledMethod = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (!enabledMethod)
			throw new _2FANotFound(method);

		await this.twoFactorRepository.deleteEnabledMethodByID(enabledMethod.id);

		return ;
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