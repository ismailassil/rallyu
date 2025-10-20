import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenInvalidError, TokenExpiredError } from '../../types/exceptions/auth.exceptions';
import { generateUUID, nowInSeconds, nowPlusSeconds } from '../../services/TwoFactorAuth/utils';

export interface JWT_ACCESS_PAYLOAD {
	sub: number
}

export interface JWT_REFRESH_PAYLOAD {
	sub: number,
	session_id: string,
	version: number
}

export type JWT_TOKEN = string;

export interface JWTUtilsOptions {
	accessSecret: string;
	refreshSecret: string;
	accessExpires: number;		// IN SECONDS
	refreshExpires: number;		// IN SECONDS
}

class JWTUtils {
	constructor(private config: JWTUtilsOptions) {}

	private signJWT<T extends object>(payload: T, secret: string, expiresInSeconds: number) : Promise<string> {
		return new Promise((resolve, reject) => {

			jwt.sign(payload, secret, {
				algorithm: 'HS256',
				expiresIn: expiresInSeconds
			}, (err, token) => {
				if (err || !token) {
					reject(err);
					return ;
				}
				resolve(token as string);
			});

		});
	}

	private verifyJWT<T extends object>(token: string, secret: string) : Promise<T & { exp: number, iat: number }> {
		return new Promise((resolve, reject) => {

			jwt.verify(token, secret, {
				algorithms: ['HS256']
			}, (err, decoded) => {
				if (err || !decoded) {
					reject(err);
					return ;
				}
				resolve(decoded as T & { exp: number, iat: number });
			});

		});
	}

	public decodeJWT<T extends object>(token: string) : T & { exp: number, iat: number } {
		const decoded = jwt.decode(token);
		if (!decoded || typeof(decoded) !== 'object')
			throw new Error('Can\'t decode token!');

		return decoded as T & { exp: number, iat: number };
	}

	public async verifyAccessToken(accessToken: string) {
		return await this.verifyJWT<JWT_ACCESS_PAYLOAD>(accessToken, this.config.accessSecret);
	}

	public async verifyRefreshToken(refreshToken: string) {
		return await this.verifyJWT<JWT_REFRESH_PAYLOAD>(refreshToken, this.config.refreshSecret);
	}

	public async generateTokenPair(
		sub: number,
		session_id: string = generateUUID(),
		session_version: number = 1
	) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {

		const accessPayload: JWT_ACCESS_PAYLOAD = {
			sub
		}

		const refreshPayload: JWT_REFRESH_PAYLOAD = {
			sub,
			session_id,
			version: session_version
		}

		const accessToken = await this.signJWT(accessPayload, this.config.accessSecret, this.config.accessExpires);
		const refreshToken = await this.signJWT(refreshPayload, this.config.refreshSecret, this.config.refreshExpires);

		return { accessToken, refreshToken };
	}
}

export default JWTUtils;
