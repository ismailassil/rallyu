import UserRepository from "../repositories/userRepository";
import jwt from 'jsonwebtoken'
import { CreateUserRequest, ILoginRequest, IRegisterRequest, ISQLCreateUser, User } from "../types";
import bcrypt from 'bcrypt';
import AuthUtils, { JWT_TOKEN, JWT_REFRESH_PAYLOAD } from '../utils/auth/Auth'
import { FormError, FormFieldMissing, InvalidCredentialsError, PasswordLengthError, SessionExpiredError, SessionNotFoundError, SessionRevokedError, TokenExpiredError, TokenInvalidError, TokenRequiredError, UserAlreadyExistsError, UserNotFoundError, UsernameLengthError, WeakPasswordError } from "../types/auth.types";
import SessionManager, { SessionConfig } from "./sessionService";
import { ISessionFingerprint } from "../types";
import { UAParser } from 'ua-parser-js';
import axios from "axios";
import 'dotenv/config';
import { z } from 'zod';

// TODO
	// VERIFY THE EXISTENCE OF ALL THOSE ENV VARS
const GOOGLE_OAUTH_CLIENT_ID = process.env['GOOGLE_OAUTH_CLIENT_ID'];
const GOOGLE_OAUTH_CLIENT_SECRET = process.env['GOOGLE_OAUTH_CLIENT_SECRET'];
const GOOGLE_OAUTH_BACKEND_REDIRECT_URI = process.env['GOOGLE_OAUTH_BACKEND_REDIRECT_URI'];
const GOOGLE_OAUTH_FRONTEND_REDIRECT_URI = process.env['GOOGLE_OAUTH_FRONTEND_REDIRECT_URI'];
const GOOGLE_OAUTH_AUTH_URI = process.env['GOOGLE_OAUTH_AUTH_URI'];
const GOOGLE_OAUTH_EXCHANGE_URL = process.env['GOOGLE_OAUTH_EXCHANGE_URL'];

const INTRA_OAUTH_CLIENT_ID = process.env['INTRA_OAUTH_CLIENT_ID'];
const INTRA_OAUTH_CLIENT_SECRET = process.env['INTRA_OAUTH_CLIENT_SECRET'];
const INTRA_OAUTH_BACKEND_REDIRECT_URI = process.env['INTRA_OAUTH_BACKEND_REDIRECT_URI'];
const INTRA_OAUTH_FRONTEND_REDIRECT_URI = process.env['INTRA_OAUTH_FRONTEND_REDIRECT_URI'];
const INTRA_OAUTH_AUTH_URI = process.env['INTRA_OAUTH_AUTH_URI'];
const INTRA_OAUTH_EXCHANGE_URL = process.env['INTRA_OAUTH_EXCHANGE_URL'];

export interface AuthConfig {
	bcryptRounds: number,
	bcryptDummyHash: string,
	accessTokenExpiry: string,
	refreshTokenExpiry: string,
	sessionHardExpiry: string,
	maxConcurrentSessions: number,
	maxSessionFingerprintChange: number,
	allowIpChange: boolean,
	allowBrowserChange: boolean,
	allowDeviceChange: boolean
}

class AuthService {
	private userRepository: UserRepository;
	private authUtils: AuthUtils;
	private authConfig: AuthConfig;
	private sessionManager: SessionManager;

	constructor(config: AuthConfig) {
		this.authConfig = config;
		this.userRepository = new UserRepository();
		this.sessionManager = new SessionManager(config);
		this.authUtils = new AuthUtils();
	}

	async SignUp(first_name: string, last_name: string, username: string, email: string, password: string) : Promise<void> {
		this.validateRegisterForm(username, password, email, first_name, last_name);

		if (await this.userRepository.findByUsername(username) != null)
			throw new UserAlreadyExistsError('Username');
		if (await this.userRepository.findByEmail(email) != null)
			throw new UserAlreadyExistsError('Email');

		const hashedPassword = await bcrypt.hash(password!, this.authConfig.bcryptRounds);

		const createdUserID = await this.userRepository.create(
			username,
			email,
			first_name,
			last_name,
			'https://pbs.twimg.com/profile_images/1300555471468851202/xtUnFLEm_200x200.jpg',
			'local',
			hashedPassword
		);
	}

	async LogIn(username: string, password: string, userAgent: string, ip: string) : Promise<{ user: Omit<User, 'password'>, accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
		const currentSessionFingerprint = this.getFingerprint(userAgent, ip);

		const existingUser = await this.userRepository.findByUsername(username);
		const isValidPassword = 
			await bcrypt.compare(password, existingUser ? existingUser.password : this.authConfig.bcryptDummyHash);
		if (!existingUser || !isValidPassword)
			throw new InvalidCredentialsError();

		// clean up expired refresh tokens
		// force max concurrent sessions

		const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
			existingUser.id,
			this.authConfig.accessTokenExpiry,
			this.authConfig.refreshTokenExpiry
		);

		await this.sessionManager.createSession(
			refreshToken,
			currentSessionFingerprint
		);

		const { password: _, ...userWithoutPassword} = existingUser;

		return { user: userWithoutPassword, accessToken, refreshToken };
	}

	async LogOut(refreshToken: string, userAgent: string, ip: string) : Promise<void> {
		const currentSessionFingerprint = this.getFingerprint(userAgent, ip);

		let payload: JWT_REFRESH_PAYLOAD;
	
		try {
			payload = await this.authUtils.verifyRefreshToken(refreshToken);
		} catch (err) {
			await this.sessionManager.revokeSession(refreshToken, 'inactivity');
			throw err; // (TokenInvalid/Expired) // delete related session
		}

		await this.sessionManager.validateSession(
			refreshToken,
			currentSessionFingerprint
		);

		await this.sessionManager.revokeSession(
			refreshToken,
			'logout'
		);
	}

	async Refresh(refreshToken: string, userAgent: string, ip: string) : Promise<{ newAccessToken: JWT_TOKEN, newRefreshToken: JWT_TOKEN }> {
		const currentSessionFingerprint = this.getFingerprint(userAgent, ip);
		
		let payload: JWT_REFRESH_PAYLOAD;

		try {
			payload = await this.authUtils.verifyRefreshToken(refreshToken);
		} catch (err) {
			await this.sessionManager.revokeSession(refreshToken, 'inactivity');
			throw err; // (TokenInvalid/Expired) // delete related session
		}
		
		await this.sessionManager.validateSession(
			refreshToken,
			currentSessionFingerprint
		);
		
		const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authUtils.generateTokenPair(
			payload.sub,
			this.authConfig.accessTokenExpiry,
			this.authConfig.refreshTokenExpiry,
			payload.session_id,
			payload.version + 1
		);
		
		await this.sessionManager.refreshSession(
			newRefreshToken,
			currentSessionFingerprint
		);

		return { newAccessToken, newRefreshToken };
	}

	// TO CHECK
	async GoogleLogIn(code: string, userAgent: string, ip: string) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
		try {
			const { id_token } = await this.getGoogleOAuthTokens(code);
			// verify token signature?
			const decodedJWT = jwt.decode(id_token);

			const userData = this.GoogleOAuthTokenToData(decodedJWT);

			let	  createdUser;
			const usernameExists = await this.userRepository.findByUsername(userData.username);
			const emailExists = await this.userRepository.findByUsername(userData.email);
			const isRegistered = usernameExists || emailExists;
			if (!isRegistered) {
				const createdUserID = await this.userRepository.create(
					userData.username, userData.email, userData.first_name, userData.last_name,
					userData.avatar_url, userData.auth_provider
				);
				createdUser = await this.userRepository.findById(createdUserID);
			} else {
				createdUser = await this.userRepository.findByUsername(userData.username);
			}

			const currentSessionFingerprint = this.getFingerprint(userAgent, ip);
			// clean up expired refresh tokens
			// force max concurrent sessions

			const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
				createdUser!.id,
				this.authConfig.accessTokenExpiry,
				this.authConfig.refreshTokenExpiry
			);

			await this.sessionManager.createSession(
				refreshToken,
				currentSessionFingerprint
			);

			return { accessToken, refreshToken };

		} catch (err) {
			console.log(err);
			throw new Error('OAuth Google failed');
		}
	}

	// TO CHECK
	async IntraLogIn(code: string, userAgent: string, ip: string) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
		try {
			const { access_token } = await this.getIntraOAuthTokens(code);

			const userData = await this.IntraOAuthTokenToData(access_token);

			let	  createdUser;
			const usernameExists = await this.userRepository.findByUsername(userData.username);
			const emailExists = await this.userRepository.findByEmail(userData.email);
			const isRegistered = usernameExists || emailExists;
			if (!isRegistered) {
				const createdUserID = await this.userRepository.create(
					userData.username, userData.email, userData.first_name, userData.last_name,
					userData.avatar_url, userData.auth_provider
				);
				createdUser = await this.userRepository.findById(createdUserID);
			} else {
				createdUser = await this.userRepository.findByUsername(userData.username);
			}

			const currentSessionFingerprint = this.getFingerprint(userAgent, ip);
			// clean up expired refresh tokens
			// force max concurrent sessions

			const { accessToken, refreshToken } = await this.authUtils.generateTokenPair(
				createdUser!.id,
				this.authConfig.accessTokenExpiry,
				this.authConfig.refreshTokenExpiry
			);

			await this.sessionManager.createSession(
				refreshToken,
				currentSessionFingerprint
			);

			return { accessToken, refreshToken };

		} catch (err) {
			console.log(err);
			throw new Error('OAuth Intra failed');
		}
	}

	async changePassword(user_id: number, old_password: string, new_password: string) {
		this.validateChangePasswordForm(old_password, new_password);

		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		
		const isValidPassword = 
			await bcrypt.compare(old_password, existingUser.password);
		if (!isValidPassword)
			throw new InvalidCredentialsError();
		
		const hashedNewPassword = await bcrypt.hash(new_password!, this.authConfig.bcryptRounds);

		this.userRepository.update(user_id, { password: hashedNewPassword });
	}

	async fetchMe(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return this.extractPublicUserInfo(existingUser);
	}

	private validateChangePasswordForm(old_password: string, new_password: string) {
		if (old_password === new_password)
			throw new Error('Passwords are the same');

		const changePasswordSchema = z.object({
			old_password: z.string()
				.min(8, "Password must be at least 8 characters")
				.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
				.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
				.regex(/(?=.*\d)/, "Password must contain a digit"),
			
			new_password: z.string()
				.min(8, "Password must be at least 8 characters")
				.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
				.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
				.regex(/(?=.*\d)/, "Password must contain a digit")
		});

		const validationResult = changePasswordSchema.safeParse({ old_password, new_password });
		if (!validationResult.success) {
			const errors = validationResult.error.flatten();
			throw new FormError(undefined, errors.fieldErrors);
		}
	}

	private validateRegisterForm(username: string, password: string, email: string, first_name: string, last_name: string) {
		const registerSchema = z.object({
			first_name: z.string()
				.min(2, "First name must be at least 2 characters")
				.max(10, "First name must be at most 10 characters")
				.regex(/^[A-Za-z]+$/, "First name must contain only letters"),
			
			last_name: z.string()
				.min(2, "Last name must be at least 2 characters")
				.max(10, "Last name must be at most 10 characters")
				.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
			
			username: z.string()
				.min(3, "Username must be at least 3 characters")
				.max(50, "Username must be at least 50 characters")
				.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
		  
			email: z.string()
				.email("Invalid email address"),
		  
			password: z.string()
				.min(8, "Password must be at least 8 characters")
				.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
				.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
				.regex(/(?=.*\d)/, "Password must contain a digit")
		});

		const validationResult = registerSchema.safeParse({ first_name, last_name, username, password, email });
		if (!validationResult.success) {
			const errors = validationResult.error.flatten();
			throw new FormError(undefined, errors.fieldErrors);
		}
	}

	private getBearerToken(authHeader: string | undefined) : string {
		if (!authHeader)
			throw new TokenRequiredError();

		const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
		if (!bearerToken)
			throw new TokenRequiredError();

		return bearerToken;
	}

	private getFingerprint(userAgent: string, ip: string) : ISessionFingerprint {
		const parser = new UAParser(userAgent);

		const ua = parser.getResult();

		let deviceName = [ ua.device.vendor || '', ua.device.model || '', ua.os.name || '', ua.os.version || ''].filter(Boolean).join(' ').trim();
		let browserVersion = [ ua.browser.name || '', ua.browser.major || '' ].filter(Boolean).join(' ').trim();

		if (!deviceName)
			deviceName = 'Unknown Device';
		if (!browserVersion)
			browserVersion = 'Unknown Browser';

		const fingerprint: ISessionFingerprint = {
			device_name: deviceName,
			browser_version: browserVersion,
			ip_address: ip
		}

		return fingerprint;
	}

	// TO CHECK
	private async getGoogleOAuthTokens(code: string): Promise<any> {
		const body = {
			code,
			client_id: GOOGLE_OAUTH_CLIENT_ID,
			client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
			redirect_uri: GOOGLE_OAUTH_BACKEND_REDIRECT_URI,
			grant_type: 'authorization_code'
		};

		const { data } = await axios.post(GOOGLE_OAUTH_EXCHANGE_URL!, body);
		console.log(data);
		return data;
	}

	// TO CHECK
	private GoogleOAuthTokenToData(data: any) : ISQLCreateUser {
		return {
			email: data.email,
			username: data.email.split('@')[0],
			first_name: data.given_name || data.name.split(' ')[0] || 'Ismail',
			last_name: data.family_name || data.name.split(' ')[1] || 'Demnati',
			avatar_url: data.picture || 'https://pbs.twimg.com/profile_images/1300555471468851202/xtUnFLEm_200x200.jpg',
			auth_provider: 'Google'
		}
	}

	// TODO
		// ADD STATE FOR CSRF
	// TO CHECK
	private async getIntraOAuthTokens(code: string): Promise<any> {
		const body = {
			code,
			client_id: INTRA_OAUTH_CLIENT_ID,
			client_secret: INTRA_OAUTH_CLIENT_SECRET,
			redirect_uri: INTRA_OAUTH_BACKEND_REDIRECT_URI,
			grant_type: 'authorization_code'
		};

		const { data } = await axios.post(INTRA_OAUTH_EXCHANGE_URL!, body);
		console.log(data);
		return data;
	}

	// TO CHECK
	private async IntraOAuthTokenToData(access_token: string) : Promise<ISQLCreateUser> {
		const { data } = await axios.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}`);

		return {
			email: data.email,
			username: data.login,
			first_name: data.first_name || data.usual_first_name.split(' ')[0] || data.displayname.split(' ')[0],
			last_name: data.last_name || data.usual_last_name.split(' ')[0] || data.displayname.split(' ')[0],
			avatar_url: data.image.link || 'https://pbs.twimg.com/profile_images/1300555471468851202/xtUnFLEm_200x200.jpg',
			auth_provider: '42'
		}
	}

	private extractPublicUserInfo(privateUserInfo: any) {
		console.log('PRIVATE INFO: ', privateUserInfo);
		const publicUserInfo = {
			id: privateUserInfo.id,
			first_name: privateUserInfo.first_name,
			last_name: privateUserInfo.last_name,
			email: privateUserInfo.email,
			username: privateUserInfo.username,
			bio: privateUserInfo.bio,
			avatar_path: privateUserInfo.avatar_path,
			role: privateUserInfo.role
		}

		return publicUserInfo;
	}
}

export default AuthService;