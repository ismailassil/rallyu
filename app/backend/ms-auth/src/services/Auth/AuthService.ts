import bcrypt from 'bcrypt';
import { JWT_REFRESH_PAYLOAD } from '../../utils/auth/JWTUtils'
import { ISessionFingerprint } from "../../types";
import UserService from "../User/UserService";
import SessionService from "./SessionsService";
import { AuthConfig } from "../../config/auth";
import JWTUtils from "../../utils/auth/JWTUtils";
import MailingService from '../Communication/MailingService';
import WhatsAppService from '../Communication/WhatsAppService';
import TwoFactorMethodService from '../TwoFactorAuth/TwoFactorMethodService';
import TwoFactorChallengeService from '../TwoFactorAuth/TwoFactorChallengeService';
import {
	AuthChallengeExpired,
} from '../../types/exceptions/verification.exceptions';
import { InvalidAuthProviderError } from '../../types/exceptions/auth.exceptions';
import { InvalidCredentialsError } from '../../types/exceptions/auth.exceptions';
import { UserAlreadyExistsError } from '../../types/exceptions/user.exceptions';
import { UserNotFoundError } from '../../types/exceptions/user.exceptions';
import axios, { create } from 'axios';
import { oauthConfig } from '../../config/oauth';
import { UUID, randomBytes } from 'crypto';
import { AuthChallengeMethod } from '../../repositories/AuthChallengesRepository';
import CDNService from '../CDN/CDNService';
import fastify from '../../server';
import logger from '../../utils/misc/logger';

class AuthService {
	private cdnService: CDNService;

	constructor(
		private authConfig: AuthConfig,
		private jwtUtils: JWTUtils,
		private userService: UserService,
		private sessionService: SessionService,
		private twoFAMethodService: TwoFactorMethodService,
		private twoFAChallengeService: TwoFactorChallengeService,
		private mailingService: MailingService,
		private smsService: WhatsAppService
	) {
		this.cdnService = new CDNService();
	}

	async SignUp(first_name: string, last_name: string, username: string, email: string, password: string) : Promise<void> {
		const hashedPassword = await bcrypt.hash(password!, this.authConfig.bcryptHashRounds);

		await this.userService.createUser(
			first_name,
			last_name,
			username,
			email,
			password,
			hashedPassword
		);
	}

	async LogIn(username: string, password: string, reqFingerprint: ISessionFingerprint) {
		const existingUser = await this.userService.getUserByUsername(username);
		if (existingUser && existingUser.auth_provider !== 'Local')
			throw new InvalidCredentialsError();

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
				token: await this.twoFAChallengeService.createChallenge(existingUser.id)
			};

		const { accessToken, refreshToken } = await this.sessionService.createSession(existingUser.id, reqFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, accessToken, refreshToken };
	}

	async LogOut(refreshTokenPayload: JWT_REFRESH_PAYLOAD & { iat: number, exp: number }) : Promise<void> {
		await this.sessionService.revokeSession(
			refreshTokenPayload.session_id,
			refreshTokenPayload.sub,
			'Logout requested by user'
		);
	}

	async Refresh(refreshTokenPayload: JWT_REFRESH_PAYLOAD & { iat: number, exp: number }, reqFingerprint: ISessionFingerprint) {
		const existingUser = await this.userService.getUserById(refreshTokenPayload.sub);
		if (!existingUser)
			throw new UserNotFoundError();

		const { newAccessToken, rotatedRefreshToken }
			= await this.sessionService.refreshSession(refreshTokenPayload, reqFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, newAccessToken, rotatedRefreshToken };
	}

	async sendTwoFAChallengeCode(token: UUID, method: AuthChallengeMethod, sessionFingerprint: ISessionFingerprint) {
		await this.twoFAChallengeService.selectMethod(token, method);
	}

	async verifyTwoFAChallengeCode(token: UUID, code: string, sessionFingerprint: ISessionFingerprint) {
		await this.twoFAChallengeService.verifyChallenge(token, code);

		const targetChall = await this.twoFAChallengeService.getChallengeByToken(token);
		if (!targetChall)
			throw new AuthChallengeExpired();

		const targetUser = await this.userService.getUserById(targetChall.user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		const sessionTokens = await this.sessionService.createSession(targetUser.id, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = targetUser;

		return { user: userWithoutPassword, accessToken: sessionTokens.accessToken, refreshToken: sessionTokens.refreshToken };
	}

	async resendTwoFAChallengeCode(token: UUID) {
		await this.twoFAChallengeService.resendChallenge(token);
	}

	async loginIntra42(authorizationCode: string, sessionFingerprint: ISessionFingerprint) {
		const intra42User = await this.exchangeAuthCodeIntra42(authorizationCode);

		let existingUser = await this.userService.getUserByAuthProvider(intra42User.auth_provider, intra42User.auth_provider_id);
		if (!existingUser) {
			if (await this.userService.isEmailTaken(intra42User.email))
				throw new InvalidAuthProviderError('Local');

			const createdUserID = await this.userService.createUser(
				intra42User.first_name,
				intra42User.last_name,
				intra42User.username,
				intra42User.email,
				null,
				null,
				intra42User.avatar_url,
				intra42User.auth_provider,
				intra42User.auth_provider_id
			);

			existingUser = await this.userService.getUserById(createdUserID);
		}

		const sessionTokens = await this.sessionService.createSession(existingUser.id, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, accessToken: sessionTokens.accessToken, refreshToken: sessionTokens.refreshToken };
	}

	private async exchangeAuthCodeIntra42(authorizationCode: string) {
		try {
			const { data: exchangeResult } = await axios.post(oauthConfig.intra42.exchange_uri,
				null,
				{
					params: {
						code: authorizationCode,
						client_id: oauthConfig.intra42.client_id,
						client_secret: oauthConfig.intra42.client_secret,
						redirect_uri: oauthConfig.intra42.redirect_uri,
						grant_type: 'authorization_code'
					}
				}
			);

			if (!exchangeResult.access_token)
				throw new Error('Cannot find access_token');

			return await this.parseIntra42OAuthAccessToken(exchangeResult.access_token);
		} catch (err) {
			console.error('Google token exchange failed');
			throw err;
		}
	}

	private async parseIntra42OAuthAccessToken(accessToken: string) {
		const { data: intra42User } = await axios.get(oauthConfig.intra42.api_uri,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);

		console.log('Intra42User: ', intra42User);

		return {
			auth_provider_id: intra42User.id,
			email: intra42User.email,
			username: await this.generateUniqueUsername(intra42User.login),
			first_name: intra42User.first_name || intra42User.usual_full_name.split(' ')[0] || 'Ismail',
			last_name: intra42User.last_name || intra42User.usual_full_name.split(' ')[1] || 'Demnati',
			avatar_url: '/users/avatars/' + (await this.cdnService.storeFromURL(intra42User.image.link)).split('/')[1],
			auth_provider: '42'
		};
	}

	async loginGoogleOAuth(authorizationCode: string, sessionFingerprint: ISessionFingerprint) {
		const googleUser = await this.exchangeAuthCodeGoogle(authorizationCode);

		let existingUser = await this.userService.getUserByAuthProvider(googleUser.auth_provider, googleUser.auth_provider_id);
		if (!existingUser) {
			if (await this.userService.isEmailTaken(googleUser.email))
				throw new InvalidAuthProviderError('Local');

			const createdUserID = await this.userService.createUser(
				googleUser.first_name,
				googleUser.last_name,
				googleUser.username,
				googleUser.email,
				null,
				null,
				googleUser.avatar_url,
				googleUser.auth_provider,
				googleUser.auth_provider_id
			);

			existingUser = await this.userService.getUserById(createdUserID);
		}

		const sessionTokens = await this.sessionService.createSession(existingUser.id, sessionFingerprint);

		const { password: _, ...userWithoutPassword } = existingUser;

		return { user: userWithoutPassword, accessToken: sessionTokens.accessToken, refreshToken: sessionTokens.refreshToken };
	}

	async exchangeAuthCodeGoogle(authorizationCode: string) {
		try {
			const { data: exchangeResult } = await axios.post(oauthConfig.google.exchange_uri,
				null,
				 {
					params: {
						code: authorizationCode,
						client_id: oauthConfig.google.client_id,
						client_secret: oauthConfig.google.client_secret,
						redirect_uri: oauthConfig.google.redirect_uri,
						grant_type: 'authorization_code',
					}
				}
			);

			if (!exchangeResult.id_token)
				throw new Error("Cannot find id_token");

			return await this.parseGoogleOAuthIDToken(exchangeResult.id_token);
		} catch (err) {
			console.error("Google token exchange failed");
			throw err;
		}
	}

	private async parseGoogleOAuthIDToken(IDToken: string) {
		const payload: any = this.jwtUtils.decodeJWT(IDToken);

		return {
			auth_provider_id: payload.sub,
			email: payload.email,
			username: await this.generateUniqueUsername(payload.email.split('@')[0]),
			first_name: payload.given_name || payload.name.split(' ')[0] || 'Ismail',
			last_name: payload.family_name || payload.name.split(' ')[1] || 'Demnati',
			avatar_url: '/users/avatars/' + (await this.cdnService.storeFromURL(payload.picture)).split('/')[1],
			auth_provider: 'Google'
		};
	}

	private sanitizeBaseUsername(baseUsername: string) {
		if (!baseUsername)
			return 'user';

		// everything except a-z, 0-9, _, -
		let clean = baseUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '');

		if (clean.length < 1)
			clean = 'user';

		return clean.substring(0, 10);
	}

	private async generateUniqueUsername(baseUsername: string) {
		const MAX_ATTEMPTS = 10000000;

		let sanitizedBase = this.sanitizeBaseUsername(baseUsername);
		let uniqueUsername = sanitizedBase;

		let counter = 0;
		while (counter < MAX_ATTEMPTS) {
			if (!await this.userService.isUsernameTaken(uniqueUsername))
				return uniqueUsername;

			uniqueUsername = `${sanitizedBase}${++counter}`;
		}

		counter = 0;
		while (counter < MAX_ATTEMPTS) {
			if (!await this.userService.isUsernameTaken(uniqueUsername))
				return uniqueUsername;

			uniqueUsername = `${sanitizedBase}${randomBytes(2).toString('hex')}`;
		}

		return uniqueUsername;
	}

	async changePassword(user_id: number, oldPassword: string, newPassword: string) {
		const existingUser = await this.userService.getUserById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		logger.debug({ user_id, oldPassword, newPassword }, '[CHANGE PASSWORD ARGS]')

		const isValidPassword =
			await bcrypt.compare(oldPassword, existingUser.password);
		if (!isValidPassword)
			throw new InvalidCredentialsError('Invalid password');

		const newHashedPassword = await bcrypt.hash(newPassword!, this.authConfig.bcryptHashRounds);

		await this.userService.updateUser(user_id, { password: newHashedPassword });
	}

}

export default AuthService;
