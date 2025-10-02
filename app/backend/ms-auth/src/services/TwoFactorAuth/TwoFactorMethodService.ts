import { generateOTP, generateTOTPSecrets, verifyOTP, verifyTOTP, nowPlusSeconds, nowInSeconds } from './utils';
import TwoFactorRepository from '../../repositories/twoFactorRepository';
import UserService from '../User/userService';
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import { NoEmailIsAssociated, NoPhoneIsAssociated, _2FAAlreadyEnabled, _2FAExpiredCode, _2FAInvalidCode, _2FANotFound } from '../../types/auth.types';
import { mailingConfig } from '../../config/mailing';

const twoFAConfig = {
	pendingExpirySeconds: 5 * 60,
}

class TwoFactorMethodService {

	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	async getEnabledMethods(userID: number) {
		const targetUser = await this.userService.getUserById(userID);

		return (await this.twoFactorRepository.findEnabledMethodsByUserID(userID)).map(m => m.method);
	}

	private async createEnabled(method: 'TOTP' | 'SMS' | 'EMAIL', totp_secret: string | null, userID: number) {
		const targetUser = await this.userService.getUserById(userID);

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

	async createPending(method: 'TOTP' | 'SMS' | 'EMAIL', userID: number) {
		const targetUser = await this.userService.getUserById(userID);

		const isAlreadyEnabled = await this.twoFactorRepository.findEnabledMethodByType(userID, method);
		if (isAlreadyEnabled)
			throw new _2FAAlreadyEnabled(method);

		const isPendingExists = await this.twoFactorRepository.findPendingMethodByType(userID, method);
		if (isPendingExists)
			await this.twoFactorRepository.deletePendingMethodByID(isPendingExists.id);

		let secret = method === 'TOTP' ? await generateTOTPSecrets() : generateOTP();
		await this.twoFactorRepository.createPendingMethod(
			method, 
			method === 'TOTP' ? (secret as { secret_base32: string, secret_qrcode_url: string }).secret_base32 : secret as string, 
			nowPlusSeconds(twoFAConfig.pendingExpirySeconds),
			userID
		);

		await this.notifyUser(targetUser, method, secret as string);

		return secret;
	}

	async enablePending(method: 'TOTP' | 'SMS' | 'EMAIL', code: string, userID: number) {
		const targetUser = await this.userService.getUserById(userID);

		const pendingMethod = await this.twoFactorRepository.findPendingMethodByType(userID, method);
		if (!pendingMethod)
			throw new _2FANotFound(method);
		
		const isExpired = nowInSeconds() > pendingMethod.expires_at;
		if (method !== 'TOTP' && isExpired)
			throw new _2FAExpiredCode(method);

		const isValid = method === 'TOTP' ? verifyTOTP(pendingMethod.temp_value, code) : verifyOTP(pendingMethod.temp_value, code);
		if (!isValid)
			throw new _2FAInvalidCode(method);

		await this.createEnabled(method, method === 'TOTP' ? pendingMethod.temp_value : null, userID);

		return ;
	}

	async disableEnabled(method: 'TOTP' | 'SMS' | 'EMAIL', userID: number) {
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

export default TwoFactorMethodService;