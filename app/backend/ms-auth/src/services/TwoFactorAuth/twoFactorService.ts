import TwoFactorRepository from "../../repositories/twoFactorRepository";
import { InternalServerError, InvalidCredentialsError, SessionExpiredError, SessionNotFoundError, UserNotFoundError, _2FAAlreadyEnabled, _2FAExpiredCode, _2FAInvalidCode, _2FANotEnabled, _2FANotFound } from "../../types/auth.types";
import MailingService from "../Communication/MailingService";
import WhatsAppService from "../Communication/WhatsAppService";
import UserService from "../User/userService";

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class TwoFactorService {
	constructor(
		private twoFactorRepository: TwoFactorRepository,
		private userService: UserService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	/*----------------------------------------------- GETTERS -----------------------------------------------*/
	
	async getEnabledMethodById(id: number, userID: number) {
		return await this.twoFactorRepository.findEnabled2FAMethodById(id, userID);
	}

	async getEnabledMethodByType(type: string, userID: number) {
		return await this.twoFactorRepository.findEnabled2FAMethodByType(type, userID);
	}

	async getEnabledMethods(userID: number) {
		const enabledMethods = await this.twoFactorRepository.findEnabled2FAMethods(userID);

		return enabledMethods.map((m: any) => m.method);
	}

	async getPendingMethodById(id: number, userID: number) {
		return await this.twoFactorRepository.findPending2FAMethodById(id, userID);
	}
	
	async getPendingMethodByType(type: string, userID: number) {
		return await this.twoFactorRepository.findPending2FAMethodByType(type, userID);
	}

	async getPendingMethods(userID: number) {
		return await this.twoFactorRepository.findPending2FAMethods(userID);
	}

	// async getPendingLoginSessionById(id: number, userID: number) {
	async getPendingLoginSessionById(id: number) {
		return await this.twoFactorRepository.findPendingLoginSessionById(id);
	}


	/*----------------------------------------------- CREATE -----------------------------------------------*/
	// AUTH APP
	private async createPendingTOTPMethod(userID: number) {
		const totpSecrets = this.generateTOTPSecrets();
		console.log(totpSecrets);

		const pendingTOTPMethod = await this.twoFactorRepository.createPending2FAMethod(
			'totp',
			totpSecrets.base32,
			this.nowPlusMinutes(10),
			userID
		);

		if (!pendingTOTPMethod)
			throw new InternalServerError();

		const QRCodeURL = await QRCode.toDataURL(totpSecrets.otpauth_url);
		if (!QRCodeURL)
			throw new InternalServerError();

		return {
			secret_base32: totpSecrets.base32,
			secret_qrcode_url: QRCodeURL,
		};
	}
	
	// EMAIL | SMS
	private async createPendingOTPMethod(type: string, userID: number) {
		const OTPCode = this.generateOTP();

		const pendingOTPMethod = await this.twoFactorRepository.createPending2FAMethod(
			type,
			OTPCode,
			this.nowPlusMinutes(10),
			userID
		);

		if (!pendingOTPMethod)
			throw new InternalServerError();

		// return await this.getPendingMethodById(pendingOTPMethod.id, userID);
	}
	
	async createPending2FAMethod(type: string, userID: number) : Promise<{ secret_base32: string; secret_qrcode_url: string } | void> {
		const targetUser = await this.userService.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAlreadyEnabled = await this.getEnabledMethodByType(type, userID);
		if (isAlreadyEnabled)
			throw new _2FAAlreadyEnabled(type);

		this.deletePending2FAMethodsByType(type, userID); // TODO: HOW SHOULD WE HANDLE THIS?
		
		switch (type) {
			case 'totp': {
				return await this.createPendingTOTPMethod(userID);
			}
			case 'email': {
				console.log('Creating pending email method');
				await this.createPendingOTPMethod(type, userID);
				if (targetUser.email)
					await this.mailingService.sendEmail({
						from: this.mailingService.config.mailingServiceUser,
						to: targetUser.email,
						subject: 'Your RALLYU verification code',
						text: `Your verification code is: ${await this.getCurrentOTP(type, userID)}`
					});
				else
					throw new InvalidCredentialsError('No email associated with this account');
				console.log(`Email sent to ${targetUser.email} with code: ${await this.getCurrentOTP(type, userID)}`);
				break;
			}
			case 'sms': {
				console.log('Creating pending sms method');
				await this.createPendingOTPMethod(type, userID);
				if (targetUser.phone)
					await this.smsService.sendMessage(targetUser.phone, `Your RALLYU verification code is: ${await this.getCurrentOTP(type, userID)}`);
				else
					throw new InvalidCredentialsError('No phone number associated with this account');
				console.log(`SMS sent to ${targetUser.phone} with code: ${await this.getCurrentOTP(type, userID)}`);
				break;
			}
			default:
				throw new InternalServerError(); // TODO: ADD METHOD NOT SUPPORTED
		}

		// TODO: ADD SENDING EMAIL OR SMS OUTSIDE THIS CLASS
	}

	async create2FAMethod(type: string, totp_secret: string | null, userID: number) {
		const isAlreadyEnabled = await this.getEnabledMethodByType(type, userID);
		if (isAlreadyEnabled)
			throw new _2FAAlreadyEnabled(type);

		await this.twoFactorRepository.create2FAMethod(type, totp_secret, userID);
	}

	async create2FALoginChallenge(userID: number) {
		const enabledMethods = await this.getEnabledMethods(userID);
		if (enabledMethods.length == 0)
			throw new _2FANotEnabled('');

		const loginSessionID = await this.twoFactorRepository.createPendingLoginSession(null, null, 5, 5, this.nowPlusMinutes(5), userID);

		return loginSessionID;
	}
	
	/*----------------------------------------------- SOMETHINGS -----------------------------------------------*/

	// TODO: CREATE THIS.VALIDATE PENDING METHOD
	// TODO: CREATE VERIFYPENDINGMETHOD
	async enablePending2FAMethod(type: string, code: string, userID: number) : Promise<void> {
		// TODO: USER GETTERS
		const pendingMethod = await this.twoFactorRepository.findPending2FAMethodByType(type, userID);
		if (!pendingMethod)
			throw new _2FANotFound(type);

		if (this.nowInSeconds() > pendingMethod.expires_at)
			throw new _2FAExpiredCode(type);
		
		const isValid = (type === 'totp') ? this._verifyTOTP(pendingMethod.temp_value, code)
										  : this._verifyOTP(code, pendingMethod.temp_value);
		if (!isValid)
			throw new _2FAInvalidCode(type);
		
		await this.create2FAMethod(type, (type == 'totp') ? pendingMethod.temp_value : null, userID);
		
		await this.twoFactorRepository.deletePending2FAById(pendingMethod.id, userID);

		console.log(`${type} is verified, deleted from pending, added to active 2fa`);
		
		return ;
	}

	// TODO: SHOULD WE RENAME THIS TO setLoginChallengeMethod?
	async select2FALoginChallengeMethod(type: string, loginSessionID: number) {

		// CHECK IF LOGIN SESSION EXPIRED
		const pendingLoginSession = await this.getPendingLoginSessionById(loginSessionID);
		if (!pendingLoginSession)
			throw new SessionNotFoundError();

		const isExpired = this.nowInSeconds() > pendingLoginSession.expires_at;
		
		const isEnabled = await this.getEnabledMethodByType(type, pendingLoginSession.user_id);
		if (!isEnabled)
			throw new _2FANotEnabled(type);
		
		if (isExpired)
			throw new SessionExpiredError();

		if (type === 'totp')
			await this.twoFactorRepository.updatePendingLoginSession(pendingLoginSession.id, pendingLoginSession.user_id, { method: type, code: isEnabled.totp_secret });
		else
			await this.twoFactorRepository.updatePendingLoginSession(pendingLoginSession.id, pendingLoginSession.user_id, { method: type, code: this.generateOTP(), remaining_resends: pendingLoginSession.remaining_resends - 1, expires_at: this.nowPlusMinutes(5) });
		// await this.twoFactorRepository.updatePendingLoginSession(loginSessionID, type, this.generateOTP(), pendingLoginSession.remaining_attempts - 1, pendingLoginSession.remaining_resends - 1, this.nowPlusMinutes(5), pendingLoginSession.user_id);

		// TODO: SEND EMAIL OR SMS VIA NOTIFICATION SERVICE
	}

	// TODO: THIS SHOULD BE MORE GENERAL (VERIFY 2FA CODE OR IS VALID LOGIN CHALLENGE)
	async verify2FALoginChallengeCode(type: string, loginSessionID: number, code: string) {
		// TODO: SHOULD WE ABSTRACT THIS?
		// CHECK IF LOGIN SESSION EXPIRED
		const pendingLoginSession = await this.getPendingLoginSessionById(loginSessionID);
		if (!pendingLoginSession)
			throw new SessionNotFoundError();

		const isExpired = this.nowInSeconds() > pendingLoginSession.expires_at || pendingLoginSession.remaining_attempts <= 0;
		
		const isEnabled = await this.getEnabledMethodByType(type, pendingLoginSession.user_id);
		if (!isEnabled)
			throw new _2FANotEnabled(type);
		
		if (isExpired) {
			await this.deletePendingLoginChallenge(pendingLoginSession.id, pendingLoginSession.user_id);
			throw new SessionExpiredError();
		}

		await this.twoFactorRepository.updatePendingLoginSession(pendingLoginSession.id, pendingLoginSession.user_id, { remaining_attempts: pendingLoginSession.remaining_attempts - 1 });
		
		switch (type) {
			case 'totp':
				return this._verifyTOTP(pendingLoginSession.code, code);
			case 'email':
				return this._verifyOTP(pendingLoginSession.code, code);
			case 'sms':
				return this._verifyOTP(pendingLoginSession.code, code);
			default:
				throw new InternalServerError(); // TODO: ADD METHOD NOT SUPPORTED
		}
	}

	/*----------------------------------------------- DELETE -----------------------------------------------*/

	async deletePending2FAMethodById(id: number, userID: number) {
		return this.twoFactorRepository.deletePending2FAById(id, userID);
	}

	async deletePending2FAMethodsByType(type: string, userID: number) {
		return this.twoFactorRepository.deletePending2FAByType(type, userID);
	}

	async deletePendingLoginChallenge(id: number, userID: number) {
		return this.twoFactorRepository.deletePendingLoginSession(id, userID);
	}







































	// TODO: SEPARATE CREATING A LOGIN CHALLENGE FROM GETTING ENABLED METHODS
	// async createLoginChallenge(userID: number) {
	// 	// const isEnabled = await this.twoFactorRepository.findEnabled2FAMethodByType(method, user_id);
	// 	// if (isEnabled)
	// 	// 	throw new _2FANotEnabled(method);

	// 	// const code = this.generateOTP();
	// 	const sql = `INSERT INTO pending_2fa_login(method, code, expires_at, user_id) VALUES (?, ?, ?, ?)`

	// 	const { lastID } = await db.run(sql, [null, null, this.nowPlusMinutes(10), userID]);
	// 	const enabledMethods = await this.twoFactorRepository.findEnabled2FAMethods(userID);

	// 	return {
	// 		session_id: lastID, // TODD: RENAME TO CHALLENGE_ID
	// 		enabled_methods: enabledMethods
	// 	};
	// }

	// THIS CHECKS IF THE CHALLENGE IS EXPIRED
	// THIS SETS THE VERIFICATION METHOD CHOOSEN BY THE USER
	// THIS SETS THE GENERATED CODE
	// async updateLoginChallenge(method: string, session_id: number, user_id?: number) {
	// 	// const isEnabled = await this.twoFactorRepository.findEnabled2FAMethodByType(method, user_id);
	// 	// if (isEnabled)
	// 	// 	throw new _2FANotEnabled(method);

	// 	// check if session expired
	// 	const sql = `SELECT * FROM pending_2fa_login WHERE id = ?`;
	// 	const row = await db.get(sql, [session_id]);
		
	// 	// code and method update
	// 	const code = this.generateOTP();
	// 	const sql1 = `UPDATE pending_2fa_login SET method = ?, code = ?, expires_at = ? WHERE id = ?`;
	// 	await db.run(sql1, [method, code, this.nowPlusMinutes(10), session_id]);

	// 	if (method === 'email')
	// 		this.sendEmail('mock-email@gmail.com', code);
	// 	else if (method === 'sms')
	// 		this.sendSMS('+212MOCKNUMBER', code);

	// 	return ;
	// }

	// THIS CHECKS IF THE CHALLENGE OR CODE ARE EXPIRED
	// THIS SHOULD NOT GENERATE SESSION TOKENS | TODO: SHOULD USE SESSIONSERVICE
	// async verifyLoginChallenge(method: string, session_id: number, code: string, user_id?: number) {
	// 	// const isEnabled = await this.twoFactorRepository.findEnabled2FAMethodByType(method);
	// 	// if (isEnabled)
	// 	// 	throw new _2FANotEnabled(method);

	// 	// check if session/code expired

	// 	const sql = `SELECT * FROM pending_2fa_login WHERE id = ?`;

	// 	const row = await db.get(sql, [session_id]);

	// 	if (code !== row.code)
	// 		throw new _2FAInvalidCode(method);

		
	// 	const existingUser = await this.userRepository.findById(row.user_id);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	// clean up expired refresh tokens
	// 	// force max concurrent sessions

	// 	const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
	// 		existingUser.id,
	// 		'15m',
	// 		'7d'
	// 	);

	// 	const currentSessionFingerprint: ISessionFingerprint = {
	// 		device_name: '',
	// 		browser_version: '',
	// 		ip_address: ''
	// 	};

	// 	await this.sessionManager.createSession(
	// 		refreshToken,
	// 		currentSessionFingerprint
	// 	);

	// 	const { password: _, ...userWithoutPassword} = existingUser;

	// 	return { user: userWithoutPassword, accessToken, refreshToken };
	// }

	// async createPendingMethod(type: string, userID: number, contact?: string) : Promise<{ secret_base32: string | undefined, qr_code_url: string | undefined }> {
	// 	// const totp_temp_secret = this.generateTOTPSecret();

	// 	// if a totp enabled method is already setup => return
	// 	// a user can't have an active method of the same type at the same time

	// 	const isEnabled = await this.twoFactorRepository.findEnabled2FAMethodByType(type, userID);
	// 	if (isEnabled)
	// 		throw new _2FAAlreadyEnabled(type);

	// 	// ?
	// 	// await this.twoFactorRepository.findPending2FAMethodByType('totp', user_id)

	// 	await this.twoFactorRepository.deletePending2FAByType(type, userID);


	// 	let temp_value: string;
	// 	let QRCodeURL: string | undefined;

	// 	if (type === 'totp') {
	// 		const totpSecrets = this.generateTOTPSecrets();
	// 		if (!totpSecrets)
	// 			throw new InternalServerError();
	// 		temp_value = totpSecrets.base32;
	// 		QRCodeURL = await QRCode.toDataURL(totpSecrets.otpauth_url);
	// 		if (!QRCodeURL)
	// 			throw new InternalServerError();
	// 	} else {
	// 		temp_value = this.generateOTP();
	// 		if (contact) {
	// 			if (type === 'email')
	// 				this.sendEmail(contact, temp_value);
	// 			else if (type === 'sms')
	// 				this.sendSMS(contact, temp_value);
	// 		}
	// 	}

	// 	const pendingMethod = await this.twoFactorRepository.createPending2FAMethod(
	// 		type,
	// 		temp_value,
	// 		this.nowPlusMinutes(10),
	// 		userID
	// 	);

	// 	if (!pendingMethod)
	// 		throw new InternalServerError();

	// 	// console.log(`setupTOTP = ${{ secret_base32: totp_temp_secret.base32, secret_qrcode_url: QRCodeURL }}`);
	// 	return { secret_base32: type === 'totp' ? temp_value : undefined, qr_code_url: QRCodeURL };
	// }

	// async verify2FAMethod(type: string, code: string, userID: number) : Promise<boolean> {
	// 	const enabledMethod = await this.twoFactorRepository.findEnabled2FAMethodByType(type, userID);
	// 	if (!enabledMethod)
	// 		throw new _2FANotEnabled(type);

	// 	const isValid = (type === 'totp') ? this._verifyTOTP(enabledMethod.totp_secret, code.toString())
    //     								  : this._verifyOTP(code, await this.getCurrentOTP(type, userID));
	// 	if (!isValid)
	// 		throw new _2FAInvalidCode(type); // delete it

	// 	return true;
	// }

	// async verifyTOTP(totp_code: string, user_id: number) : Promise<boolean> {
	// 	const enabledTOTP = await this.twoFactorRepository.findEnabled2FAMethodByType('totp', user_id);
	// 	if (!enabledTOTP)
	// 		throw new _2FANotEnabled('TOTP');

	// 	if (!this._verifyTOTP(enabledTOTP.totp_secret, totp_code.toString()))
	// 		throw new _2FAInvalidCode('TOTP'); // delete it
	// 	return true;
	// }
	
	// async verifyOTP(method: string, otp_code: string, user_id: number) : Promise<boolean> {
	// 	const enabledOTP = await this.twoFactorRepository.findEnabled2FAMethodByType(method, user_id);
	// 	if (!enabledOTP)
	// 		throw new _2FANotEnabled(method);
		
	// 	const currentOTP = await this.twoFactorRepository.findOTPByType(method, user_id);
	// 	if (!currentOTP) // invalid ?
	// 		throw new _2FANotFound(method);
	// 	if (this.nowInSeconds() > currentOTP.expires_at) // invalid ?
	// 		throw new _2FAInvalidCode(method); // delete it

	// 	console.log(`verify: ${currentOTP.code} | ${otp_code}`);
	// 	if (!this._verifyOTP(otp_code, currentOTP.code))
	// 		throw new _2FAInvalidCode(method); // delete it
	// 	return true;
	// }

	// public async getEnabledMethods(user_id: number) {
	// 	const enabledMethods = await this.twoFactorRepository.findEnabled2FAMethods(user_id);

	// 	return enabledMethods;
	// }

	public async disableEnabledMethod(user_id: number, method: string) {
		await this.twoFactorRepository.deleteEnabled2FAByType(method, user_id);
	}

	private generateTOTPSecrets() : { base32: string, otpauth_url: string } {
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

	private async getCurrentOTP(type: string, userID: number): Promise<string> {
		const currentOTP = await this.twoFactorRepository.findPending2FAMethodByType(type, userID);

		console.log(`getCurrentOTP: ${currentOTP}`);

		// TODO: SEPARATION
		if (!currentOTP || this.nowInSeconds() > currentOTP.expires_at)
			throw new _2FAInvalidCode(type);
		return currentOTP.temp_value;
	}
}

export default TwoFactorService;