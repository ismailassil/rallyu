import { JetStreamClient } from "nats"
import { JWT_ACCESS_PAYLOAD, JWT_REFRESH_PAYLOAD } from "../utils/auth/JWTUtils"

export interface IRegisterRequest {
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	password: string,
};

export interface ILoginRequest {
	username: string,
	password: string
};

declare module 'fastify' {
	interface FastifyInstance {
		accessTokenAuth: any,
		refreshTokenAuth: any,
		apiKeyAuth: any,
		resourceOwnershipAuth: any,
		js: JetStreamClient,
		jsonC: any,
		nats: any
	}
	interface FastifyRequest {
		bearerToken: string | null;
		accessToken: string | null;
		refreshToken: string | null;
		apiKey: string | null;

		user: JWT_ACCESS_PAYLOAD | null,
		accessTokenPayload: JWT_ACCESS_PAYLOAD & { iat: number, exp: number } | null,
		refreshTokenPayload: JWT_REFRESH_PAYLOAD & { iat: number, exp: number } | null,
		fingerprint: ISessionFingerprint | null
	}
}

export interface ISessionFingerprint {
	device: string,
	browser: string,
	ip_address: string
}

export interface ErrorResponse {
	success: boolean,
	error: {
		code: string;
		message: string;
		details?: any;
	}
}

export interface SuccessResponse {
	success: boolean,
	data: any
}
