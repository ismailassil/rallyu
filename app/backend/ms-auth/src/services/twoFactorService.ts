import TwoFactorRepository from "../repositories/twoFactorRepository";
import { InternalServerError, InvalidCredentialsError, _2FAAlreadyEnabled, _2FAInvalidCode, _2FANotEnabled, _2FANotFound } from "../types/auth.types";

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class TwoFactorService {
	private twoFactorRepository: TwoFactorRepository;

	constructor() {
		this.twoFactorRepository = new TwoFactorRepository();
	}

	async setupTOTP(user_id: number) : Promise<{ secret_base32: string, secret_qrcode_url: string }> {
		const totp_temp_secret = this.generateTOTPSecret();

		// if a totp enabled method is already setup => return
		// a user can't have an active method of the same type at the same time
		const enabledTOTP = await this.twoFactorRepository.findEnabled2FAMethodByType('totp', user_id);
		if (enabledTOTP)
			throw new _2FAAlreadyEnabled('TOTP');

		// ?
		// await this.twoFactorRepository.findPending2FAMethodByType('totp', user_id) || 

		await this.twoFactorRepository.deletePending2FAByType('totp', user_id);
		const pendingTOTP = await this.twoFactorRepository.createPendingTOTP2FAMethod(
			'totp',
			totp_temp_secret.base32,
			this.nowPlusMinutes(10),
			user_id
		);

		if (!pendingTOTP)
			throw new InternalServerError();

		const QRCodeURL = await QRCode.toDataURL(totp_temp_secret.otpauth_url);

		if (!QRCodeURL)
			throw new InternalServerError();

		console.log(`setupTOTP = ${{ secret_base32: totp_temp_secret.base32, secret_qrcode_url: QRCodeURL }}`);
		return { secret_base32: totp_temp_secret.base32, secret_qrcode_url: QRCodeURL };
	}

	async setupOTP(method: string, contact: string, user_id: number) : Promise<void> {
		const otp_temp_code = this.generateOTP(); // !

		// if a totp enabled method is already setup => return
		// a user can't have an active method of the same type at the same time
		const enabledOTP = await this.twoFactorRepository.findEnabled2FAMethodByType(method, user_id);
		if (enabledOTP)
			throw new _2FAAlreadyEnabled(method);

		// ?
		// await this.twoFactorRepository.findPending2FAMethodByType(method, user_id) || 

		// should i delete all the pending OTPs of type 'method' ? YES
		await this.twoFactorRepository.deletePending2FAByType(method, user_id);
		const pendingOTP = await this.twoFactorRepository.createPendingOTP2FAMethod(
			method,
			otp_temp_code,
			this.nowPlusMinutes(5),
			user_id
		);

		if (!pendingOTP)
			throw new InternalServerError();

		console.log(`setupOTP = `);
		if (method === 'email')
			this.sendEmail(contact, otp_temp_code);
		else if (method === 'sms')
			this.sendSMS(contact, otp_temp_code);

		return ;
	}

	async confirmTOTP(totp_code: string, user_id: number) : Promise<void> {
		const pendingTOTP = await this.twoFactorRepository.findPending2FAMethodByType('totp', user_id);
		if (!pendingTOTP)
			throw new _2FANotFound('TOTP');

		if (!this._verifyTOTP(pendingTOTP.totp_temp_secret, totp_code) || this.nowInSeconds() > pendingTOTP.expires_at)
			throw new _2FAInvalidCode('TOTP');

		const newTOTP2FA = await this.twoFactorRepository.enablePending2FATOTPMethod(user_id);
		if (!newTOTP2FA)
			throw new InternalServerError();

		console.log(`TOTP is verified, deleted from pending, added to active 2fa`);
		
		return ;
	}
	
	async confirmOTP(method: string, otp_code: string, user_id: number) : Promise<void> {
		const pendingOTP = await this.twoFactorRepository.findPending2FAMethodByType(method, user_id);
		if (!pendingOTP)
			throw new _2FANotFound(method);
		
		if (!this._verifyOTP(otp_code, pendingOTP.otp_temp_code) || this.nowInSeconds() > pendingOTP.expires_at)
			throw new _2FAInvalidCode(method);
		
		const newTOTP2FA = await this.twoFactorRepository.enablePending2FAOTPMethod(method, user_id);
		if (!newTOTP2FA)
			throw new InternalServerError();

		console.log(`OTP by ${method} is verified, deleted from pending, added to active 2fa`);

		return ;
	}

	async verifyTOTP(totp_code: string, user_id: number) : Promise<boolean> {
		const enabledTOTP = await this.twoFactorRepository.findEnabled2FAMethodByType('totp', user_id);
		if (!enabledTOTP)
			throw new _2FANotEnabled('TOTP');

		if (!this._verifyTOTP(enabledTOTP.totp_secret, totp_code.toString()))
			throw new _2FAInvalidCode('TOTP'); // delete it
		return true;
	}
	
	async verifyOTP(method: string, otp_code: string, user_id: number) : Promise<boolean> {
		const enabledOTP = await this.twoFactorRepository.findEnabled2FAMethodByType(method, user_id);
		if (!enabledOTP)
			throw new _2FANotEnabled(method);
		
		const currentOTP = await this.twoFactorRepository.findOTPByType(method, user_id);
		if (!currentOTP) // invalid ?
			throw new _2FANotFound(method);
		if (this.nowInSeconds() > currentOTP.expires_at) // invalid ?
			throw new _2FAInvalidCode(method); // delete it

		console.log(`verify: ${currentOTP.code} | ${otp_code}`);
		if (!this._verifyOTP(otp_code, currentOTP.code))
			throw new _2FAInvalidCode(method); // delete it
		return true;
	}

	private generateTOTPSecret() : { base32: string, otpauth_url: string } {
		const temp_secret = speakeasy.generateSecret();

		return { base32: temp_secret.base32, otpauth_url: temp_secret.otpauth_url };
	}

	private generateOTP() {
		return ('' + Math.floor(100000 + Math.random() * 90000));
	}

	private _verifyTOTP(secret_base32: string, code: string) : boolean {
		console.log(`verify: ${secret_base32} | ${code}`);
		return speakeasy.totp.verify({
			secret: secret_base32,
			encoding: 'base32',
			token: code
		});
	}
	
	private _verifyOTP(incoming_code: string, stored_code: string) {
		console.log(`verify: ${incoming_code} | ${stored_code}`);
		return incoming_code === stored_code;
	}
	
	private sendEmail(email: string, code: string) {
		console.log(`Email sent to ${email} with code: ${code}`);
	}
	
	private sendSMS(phone: string, code: string) {
		console.log(`SMS sent to ${phone} with code: ${code}`);
	}
	
	private nowPlusMinutes(minutes: number) {
		return Math.floor((Date.now() / 1000) + minutes * 60);
	}

	private nowInSeconds() {
		return Math.floor(Date.now() / 1000);
	}
}

export default TwoFactorService;