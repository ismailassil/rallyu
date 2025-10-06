import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds } from './utils';
import TwoFactorRepository from '../../repositories/TwoFactorRepository';
import UserService from '../User/UserService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { NoEmailIsAssociated, NoPhoneIsAssociated, TwoFAChallengeExpired, TwoFAChallengeInvalidCode, TwoFAChallengeMaxAttemptsReached, TwoFAChallengeMaxResendsReached, TwoFAChallengeMethodNotSelected, TwoFAChallengeNotFound, _2FANotEnabled, _2FANotFound } from '../../types/auth.types';
import { mailingConfig } from '../../config/mailing';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
	maxAttempts: 5,
	maxResends: 3
}

class TwoFactorChallengeService {
	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	async getChallengeByID(challengeID: number) {
		const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
		if (!targetChallenge)
			throw new TwoFAChallengeNotFound();

		return targetChallenge;
	}

	async createChallenge(userID: number) {
		const targetUser = await this.userService.getUserById(userID);

		const enabledMethods = await this.twoFactorRepository.findEnabledMethodsByUserID(userID);
		if (enabledMethods.length === 0)
			throw new _2FANotEnabled('all methods');

		const challengeID = await this.twoFactorRepository.createPendingLoginSession(
			null,
			null,
			twoFAConfig.maxAttempts,
			twoFAConfig.maxResends,
			nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
			userID
		);

		return challengeID;
	}

	async selectMethod(challengeID: number, method: 'TOTP' | 'SMS' | 'EMAIL') {
		const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
		if (!targetChallenge)
			throw new TwoFAChallengeNotFound();

		const targetUser = await this.userService.getUserById(targetChallenge.user_id);

		const isEnabled = await this.twoFactorRepository.findEnabledMethodByType(targetChallenge.user_id, method);
		if (!isEnabled)
			throw new _2FANotEnabled(method);

		if (targetChallenge.expires_at < nowInSeconds())
			throw new TwoFAChallengeExpired();
		if (targetChallenge.remaining_resends <= 0)
			throw new TwoFAChallengeMaxResendsReached();

		const OTPCodeOrTOTPSecret = method === 'TOTP' ? isEnabled.totp_secret! : generateOTP();
		await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
			method: method,
			code: OTPCodeOrTOTPSecret,
			remaining_resends: targetChallenge.remaining_resends - 1,
			expires_at: nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
		});

		await this.notifyUser(targetUser, method, OTPCodeOrTOTPSecret);
	}

	async verifyChallenge(challengeID: number, code: string) {
		const targetChallenge = await this.twoFactorRepository.findPendingLoginSessionByID(challengeID);
		if (!targetChallenge)
			throw new TwoFAChallengeNotFound();

		if (!targetChallenge.method || !targetChallenge.code)
			throw new TwoFAChallengeMethodNotSelected();
		
		const targetUser = await this.userService.getUserById(targetChallenge.user_id);

		const isEnabled = await this.twoFactorRepository.findEnabledMethodByType(targetChallenge.user_id, targetChallenge.method);
		if (!isEnabled)
			throw new _2FANotEnabled(targetChallenge.method);

		if (targetChallenge.expires_at < nowInSeconds())
			throw new TwoFAChallengeExpired();
		if (targetChallenge.remaining_resends <= 0)
			throw new TwoFAChallengeMaxResendsReached();
		if (targetChallenge.remaining_attempts <= 0)
			throw new TwoFAChallengeMaxAttemptsReached();

		const isValidCode = targetChallenge.method === 'TOTP' ? verifyTOTP(isEnabled.totp_secret!, code) : verifyOTP(targetChallenge.code, code);
		if (!isValidCode) {
			await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
				remaining_attempts: targetChallenge.remaining_attempts - 1,
			});
			throw new TwoFAChallengeInvalidCode();
		}

		await this.twoFactorRepository.updatePendingLoginSession(targetChallenge.id, {
			remaining_attempts: 0,
			remaining_resends: 0,
			expires_at: nowInSeconds()
		});

		return isValidCode;
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
				subject: 'Your OTP Code',
				text: `Your OTP code is: ${OTP}. It will expire in 5 minutes.`
			});
		if (method === 'SMS')
			return await this.smsService.sendMessage(
				targetUser.phone,
				`Your OTP code is: ${OTP}. It will expire in 5 minutes.`
			);
	}
}

export default TwoFactorChallengeService;