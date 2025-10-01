import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenInvalidError, TokenExpiredError } from '../../types/auth.types';

export interface JWT_ACCESS_PAYLOAD {
	sub: number,
	role: string,
	iat: number,
	exp: number
}

export interface JWT_REFRESH_PAYLOAD {
	sub: number,
	session_id: string,
	version: number,
	iat: number,
	exp: number
}

export type JWT_TOKEN = string;

const JWT_ACCESS_SECRET = 'jwt-access-secret';
const JWT_REFRESH_SECRET = 'jwt-refresh-secret';

class JWTUtils {
	constructor() {}
	
	private signJWT<T extends object>(payload: T, JWT_SECRET: string, exp: jwt.SignOptions["expiresIn"] = '15m') : Promise<string> {
		return new Promise((resolve, reject) => {
	
			jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' }, (err, token) => {
				if (err || !token) {
					reject(err);
					return ;
				}
				resolve(token as string);
			});
	
		});
	}
	
	private verifyJWT<T extends object>(token: string, JWT_SECRET: string) : Promise<T> {
		return new Promise((resolve, reject) => {
	
			jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
				if (err || !decoded) {
					// console.log('jwt', err);
					reject(err);
					return ;
				}
				resolve(decoded as T);
			});
	
		});
	}

	public decodeJWT<T extends object>(token: string) : T {
		const decoded = jwt.decode(token);
		if (!decoded || typeof(decoded) !== 'object')
			throw new Error('Can\'t decode created refresh token!');

		return decoded as T;
	}

	public generateAccessToken(payload: JWT_ACCESS_PAYLOAD, exp = '15m') {
		return this.signJWT(payload, JWT_ACCESS_SECRET, payload.exp);
	}
	
	public generateRefreshToken(payload: JWT_REFRESH_PAYLOAD, exp = '7d') {
		return this.signJWT(payload, JWT_REFRESH_SECRET, payload.exp);
	}

	public async verifyAccessToken(token: string) {
		try {
			const payload = await this.verifyJWT<JWT_ACCESS_PAYLOAD>(token, JWT_ACCESS_SECRET);
			return payload;
		} catch (err: any) {
			if (err instanceof jwt.JsonWebTokenError)
				throw new TokenInvalidError();
			else if (err instanceof jwt.TokenExpiredError)
				throw new TokenExpiredError('Access');
			else
				throw new TokenInvalidError();
		}
	}

	public async verifyRefreshToken(token: string) {
		try {
			const payload = await this.verifyJWT<JWT_REFRESH_PAYLOAD>(token, JWT_REFRESH_SECRET);
			return payload;
		} catch (err: any) {
			if (err instanceof jwt.JsonWebTokenError)
				throw new TokenInvalidError();
			else if (err instanceof jwt.TokenExpiredError)
				throw new TokenExpiredError('Refresh');
			else
				throw new TokenInvalidError();
		}
	}

	private generateRandom32() {
		return crypto.randomBytes(32).toString('hex');
	}

	public async generateTokenPair(
		user_id: number,
		accessTokenExpiry: string,
		refreshTokenExpiry: string,
		session_id: string = this.generateRandom32(),
		session_version: number = 1
	) : Promise<{ accessToken: JWT_TOKEN, refreshToken: JWT_TOKEN }> {
		
		const now = Math.floor(Date.now() / 1000);		// now
		const at_exp = Math.floor(60 * 15);				// 15m
		const rt_exp = Math.floor(60 * 60 * 24 * 7);	// 7d

		const accessPayload: JWT_ACCESS_PAYLOAD = {
			sub: user_id,
			role: 'user',
			iat: now,
			exp: now + at_exp
		}

		const refreshPayload: JWT_REFRESH_PAYLOAD = {
			sub: user_id,
			session_id: session_id,
			version: session_version,
			iat: now,
			exp: now + rt_exp
		}

		const accessToken = await this.generateAccessToken(accessPayload);
		const refreshToken = await this.generateRefreshToken(refreshPayload);

		return { accessToken, refreshToken };
	}
}

export default JWTUtils;
