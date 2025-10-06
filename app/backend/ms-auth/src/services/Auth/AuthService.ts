import bcrypt from 'bcrypt';
import { JWT_REFRESH_PAYLOAD } from '../../utils/auth/Auth'
import { ISessionFingerprint } from "../../types";
import { UAParser } from 'ua-parser-js';
import UserService from "../User/UserService";
import SessionService from "./SessionsService";
import { AuthConfig } from "../../config/auth";
import JWTUtils from "../../utils/auth/Auth";
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import TwoFactorMethodService from '../TwoFactorAuth/TwoFactorMethodService';
import TwoFactorChallengeService from '../TwoFactorAuth/TwoFactorChallengeService';
import { 
	InvalidCredentialsError, 
	TokenRequiredError, 
	UserAlreadyExistsError, 
	UserNotFoundError, 
	_2FAInvalidCode 
} from "../../types/auth.types";

// TODO
	// VERIFY THE EXISTENCE OF ALL THOSE ENV VARS
// const GOOGLE_OAUTH_CLIENT_ID = process.env['GOOGLE_OAUTH_CLIENT_ID'];
// const GOOGLE_OAUTH_CLIENT_SECRET = process.env['GOOGLE_OAUTH_CLIENT_SECRET'];
// const GOOGLE_OAUTH_BACKEND_REDIRECT_URI = process.env['GOOGLE_OAUTH_BACKEND_REDIRECT_URI'];
// const GOOGLE_OAUTH_FRONTEND_REDIRECT_URI = process.env['GOOGLE_OAUTH_FRONTEND_REDIRECT_URI'];
// const GOOGLE_OAUTH_AUTH_URI = process.env['GOOGLE_OAUTH_AUTH_URI'];
// const GOOGLE_OAUTH_EXCHANGE_URL = process.env['GOOGLE_OAUTH_EXCHANGE_URL'];

// const INTRA_OAUTH_CLIENT_ID = process.env['INTRA_OAUTH_CLIENT_ID'];
// const INTRA_OAUTH_CLIENT_SECRET = process.env['INTRA_OAUTH_CLIENT_SECRET'];
// const INTRA_OAUTH_BACKEND_REDIRECT_URI = process.env['INTRA_OAUTH_BACKEND_REDIRECT_URI'];
// const INTRA_OAUTH_FRONTEND_REDIRECT_URI = process.env['INTRA_OAUTH_FRONTEND_REDIRECT_URI'];
// const INTRA_OAUTH_AUTH_URI = process.env['INTRA_OAUTH_AUTH_URI'];
// const INTRA_OAUTH_EXCHANGE_URL = process.env['INTRA_OAUTH_EXCHANGE_URL'];

class AuthService {
	constructor(
		private authConfig: AuthConfig,
		private jwtUtils: JWTUtils,
		private userService: UserService,
		private sessionService: SessionService,
		private twoFAMethodService: TwoFactorMethodService,
		private twoFAChallengeService: TwoFactorChallengeService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {}

	async SignUp(first_name: string, last_name: string, username: string, email: string, password: string) : Promise<void> {
		// this.validateRegisterForm(username, password, email, first_name, last_name);

		if (await this.userService.isUsernameTaken(username))
			throw new UserAlreadyExistsError('Username');
		if (await this.userService.isEmailTaken(email))
			throw new UserAlreadyExistsError('Email');

		const hashedPassword = await bcrypt.hash(password!, this.authConfig.bcryptHashRounds);

		await this.userService.createUser(first_name, last_name, username, email, password, hashedPassword);
	}

	async LogIn(username: string, password: string, sessionFingerprint: ISessionFingerprint) {
		let existingUser = null;
		try {
			existingUser = await this.userService.getUserByUsername(username);
		} catch (err) {
			throw new InvalidCredentialsError();
		}
		
		const isValidPassword = 
			await bcrypt.compare(password, existingUser ? existingUser.password : this.authConfig.bcryptTimingHash);

		if (!existingUser || !isValidPassword)
			throw new InvalidCredentialsError();

		const enabled2FAMethods = await this.twoFAMethodService.getEnabledMethods(existingUser.id);
		const _2FARequired = enabled2FAMethods.length > 0;
		if (_2FARequired)
			return {
				_2FARequired: true, 
				enabled2FAMethods, 
				loginChallengeID: await this.twoFAChallengeService.createChallenge(existingUser.id)
			};

		const sessionTokens = await this.sessionService.createSession(existingUser.id, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, accessToken: sessionTokens.accessToken, refreshToken: sessionTokens.refreshToken };
	}

	async LogOut(refreshToken: string) : Promise<void> {
		const payload: JWT_REFRESH_PAYLOAD = this.jwtUtils.decodeJWT(refreshToken);

		await this.sessionService.revokeSession(payload.session_id, 'Logout requested by user', payload.sub, refreshToken);
	}

	async Refresh(refreshToken: string, sessionFingerprint: ISessionFingerprint) {
		const refreshTokenPayload: JWT_REFRESH_PAYLOAD = this.jwtUtils.decodeJWT(refreshToken);
		const existingUser = await this.userService.getUserById(refreshTokenPayload.sub);
		if (!existingUser)
			throw new UserNotFoundError();
		
		const { newAccessToken, newRefreshToken } 
			= await this.sessionService.refreshSession(refreshToken, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, newAccessToken, newRefreshToken };
	}

	async sendTwoFAChallengeCode(loginChallengeID: number, method: 'TOTP' | 'SMS' | 'EMAIL', sessionFingerprint: ISessionFingerprint) {
		await this.twoFAChallengeService.selectMethod(loginChallengeID, method);
	}

	async verifyTwoFAChallengeCode(loginChallengeID: number, code: string, sessionFingerprint: ISessionFingerprint) {
		const isValid = await this.twoFAChallengeService.verifyChallenge(loginChallengeID, code);

		const targetChallenge = await this.twoFAChallengeService.getChallengeByID(loginChallengeID);

		const targetUser = await this.userService.getUserById(targetChallenge.user_id);

		const sessionTokens = await this.sessionService.createSession(targetUser.id, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = targetUser;

		return { user: userWithoutPassword, accessToken: sessionTokens.accessToken, refreshToken: sessionTokens.refreshToken };
	}

	// TO CHECK
	// async GoogleLogIn(code: string, userAgent: string, ip: string) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
	// 	try {
	// 		const { id_token } = await this.getGoogleOAuthTokens(code);
	// 		// TODO: VERIFY TOKEN SIGNATURE?
	// 		const decodedJWT = jwt.decode(id_token);

	// 		const userData = this.GoogleOAuthTokenToData(decodedJWT);

	// 		let	  createdUser;
	// 		const usernameExists = await this.userService.getUserByUsername(userData.username);
	// 		const emailExists = await this.userService.getUserByEmail(userData.email);
	// 		const isRegistered = usernameExists || emailExists;
	// 		if (!isRegistered) {
	// 			// const createdUserID = await this.userRepository.create(
	// 			// 	userData.username, userData.email, userData.first_name, userData.last_name,
	// 			// 	userData.avatar_url, userData.auth_provider
	// 			// );

	// 			// TODO: SHOULD USE createUserFromOAuth
	// 			const createdUserID = await this.userService.createUser(
	// 				userData.first_name, userData.last_name, userData.username, userData.email, 'temp_password'
	// 			);

	// 			createdUser = await this.userService.getUserById(createdUserID);
	// 		} else {
	// 			createdUser = await this.userService.getUserByUsername(userData.username); // TODO: WHY?
	// 		}

	// 		const currentSessionFingerprint = this.getFingerprint(userAgent, ip);
	// 		// TODO:
	// 		// clean up expired refresh tokens
	// 		// force max concurrent sessions

	// 		const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
	// 			createdUser!.id,
	// 			this.config.accessTokenExpiry,
	// 			this.config.refreshTokenExpiry
	// 		);

	// 		await this.sessionService.createSession(
	// 			refreshToken,
	// 			currentSessionFingerprint
	// 		);

	// 		return { accessToken, refreshToken };

	// 	} catch (err) {
	// 		console.log(err);
	// 		throw new Error('OAuth Google failed');
	// 	}
	// }

	// // TO CHECK
	// async IntraLogIn(code: string, userAgent: string, ip: string) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
	// 	try {
	// 		const { access_token } = await this.getIntraOAuthTokens(code);

	// 		const userData = await this.IntraOAuthTokenToData(access_token);

	// 		let	  createdUser;
	// 		const usernameExists = await this.userService.getUserByUsername(userData.username);
	// 		const emailExists = await this.userService.getUserByEmail(userData.email);
	// 		const isRegistered = usernameExists || emailExists;
	// 		if (!isRegistered) {
	// 			// const createdUserID = await this.userRepository.create(
	// 			// 	userData.username, userData.email, userData.first_name, userData.last_name,
	// 			// 	userData.avatar_url, userData.auth_provider
	// 			// );

	// 			// TODO: SHOULD USE createUserFromOAuth
	// 			const createdUserID = await this.userService.createUser(
	// 				userData.first_name, userData.last_name, userData.username, userData.email, 'temp_password'
	// 			);

	// 			createdUser = await this.userService.getUserById(createdUserID);
	// 		} else {
	// 			createdUser = await this.userService.getUserByUsername(userData.username); // TODO: WHY?
	// 		}

	// 		const currentSessionFingerprint = this.getFingerprint(userAgent, ip);
	// 		// TODO:
	// 		// clean up expired refresh tokens
	// 		// force max concurrent sessions

	// 		const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
	// 			createdUser!.id,
	// 			this.config.accessTokenExpiry,
	// 			this.config.refreshTokenExpiry
	// 		);

	// 		await this.sessionService.createSession(
	// 			refreshToken,
	// 			currentSessionFingerprint
	// 		);

	// 		return { accessToken, refreshToken };

	// 	} catch (err) {
	// 		console.log(err);
	// 		throw new Error('OAuth Intra failed');
	// 	}
	// }

	async changePassword(user_id: number, oldPassword: string, newPassword: string) {
		// this.validateChangePasswordForm(oldPassword, newPassword);

		const existingUser = await this.userService.getUserById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();
		
		const isValidPassword = 
			await bcrypt.compare(oldPassword, existingUser.password);
		if (!isValidPassword)
			throw new InvalidCredentialsError('Invalid password');
		
		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(user_id, { password: newHashedPassword });
	}

	// private validateChangePasswordForm(oldPassword: string, newPassword: string) {
	// 	if (oldPassword === newPassword)
	// 		throw new Error('Passwords are the same');

	// 	const changePasswordSchema = z.object({
	// 		newPassword: z.string()
	// 			.min(8, "Password must be at least 8 characters")
	// 			.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
	// 			.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
	// 			.regex(/(?=.*\d)/, "Password must contain a digit")
	// 	});

	// 	const validationResult = changePasswordSchema.safeParse({ newPassword });
	// 	if (!validationResult.success) {
	// 		const errors = validationResult.error.flatten();
	// 		throw new FormError(undefined, errors.fieldErrors);
	// 	}
	// }

	// private validateRegisterForm(username: string, password: string, email: string, first_name: string, last_name: string) {
	// 	const registerSchema = z.object({
	// 		first_name: z.string()
	// 			.min(2, "First name must be at least 2 characters")
	// 			.max(10, "First name must be at most 10 characters")
	// 			.regex(/^[A-Za-z]+$/, "First name must contain only letters"),
			
	// 		last_name: z.string()
	// 			.min(2, "Last name must be at least 2 characters")
	// 			.max(10, "Last name must be at most 10 characters")
	// 			.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
			
	// 		username: z.string()
	// 			.min(3, "Username must be at least 3 characters")
	// 			.max(50, "Username must be at most 50 characters")
	// 			.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
		  
	// 		email: z.string()
	// 			.email("Invalid email address"),
		  
	// 		password: z.string()
	// 			.min(8, "Password must be at least 8 characters")
	// 			.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
	// 			.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
	// 			.regex(/(?=.*\d)/, "Password must contain a digit")
	// 	});

	// 	const validationResult = registerSchema.safeParse({ first_name, last_name, username, password, email });
	// 	if (!validationResult.success) {
	// 		const errors = validationResult.error.flatten();
	// 		throw new FormError(undefined, errors.fieldErrors);
	// 	}
	// }

	private getBearerToken(authHeader: string | undefined) : string {
		if (!authHeader)
			throw new TokenRequiredError();

		const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
		if (!bearerToken)
			throw new TokenRequiredError();

		return bearerToken;
	}


	// TO CHECK
	// private async getGoogleOAuthTokens(code: string): Promise<any> {
	// 	const body = {
	// 		code,
	// 		client_id: GOOGLE_OAUTH_CLIENT_ID,
	// 		client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
	// 		redirect_uri: GOOGLE_OAUTH_BACKEND_REDIRECT_URI,
	// 		grant_type: 'authorization_code'
	// 	};

	// 	const { data } = await axios.post(GOOGLE_OAUTH_EXCHANGE_URL!, body);
	// 	console.log(data);
	// 	return data;
	// }

	// // TO CHECK
	// private GoogleOAuthTokenToData(data: any) : ISQLCreateUser {
	// 	return {
	// 		email: data.email,
	// 		username: data.email.split('@')[0],
	// 		first_name: data.given_name || data.name.split(' ')[0] || 'Ismail',
	// 		last_name: data.family_name || data.name.split(' ')[1] || 'Demnati',
	// 		avatar_url: data.picture || 'https://pbs.twimg.com/profile_images/1300555471468851202/xtUnFLEm_200x200.jpg',
	// 		auth_provider: 'Google'
	// 	}
	// }

	// TODO
		// ADD STATE FOR CSRF
	// TO CHECK
	// private async getIntraOAuthTokens(code: string): Promise<any> {
	// 	const body = {
	// 		code,
	// 		client_id: INTRA_OAUTH_CLIENT_ID,
	// 		client_secret: INTRA_OAUTH_CLIENT_SECRET,
	// 		redirect_uri: INTRA_OAUTH_BACKEND_REDIRECT_URI,
	// 		grant_type: 'authorization_code'
	// 	};

	// 	const { data } = await axios.post(INTRA_OAUTH_EXCHANGE_URL!, body);
	// 	console.log(data);
	// 	return data;
	// }

	// // TO CHECK
	// private async IntraOAuthTokenToData(access_token: string) : Promise<ISQLCreateUser> {
	// 	const { data } = await axios.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);

	// 	return {
	// 		email: data.email,
	// 		username: data.login,
	// 		first_name: data.first_name || data.usual_first_name.split(' ')[0] || data.displayname.split(' ')[0],
	// 		last_name: data.last_name || data.usual_last_name.split(' ')[0] || data.displayname.split(' ')[0],
	// 		avatar_url: data.image.link || 'https://pbs.twimg.com/profile_images/1300555471468851202/xtUnFLEm_200x200.jpg',
	// 		auth_provider: '42'
	// 	}
	// }

	private extractPublicUserInfo(privateUserInfo: any) {
		console.log('PRIVATE INFO: ', privateUserInfo);
		const publicUserInfo = {
			id: privateUserInfo.id,
			first_name: privateUserInfo.first_name,
			last_name: privateUserInfo.last_name,
			email: privateUserInfo.email,
			username: privateUserInfo.username,
			bio: privateUserInfo.bio,
			avatar_url: privateUserInfo.avatar_url,
			role: privateUserInfo.role
		}

		return publicUserInfo;
	}
}

export default AuthService;