import { JetStreamClient } from "nats"
import { JWT_ACCESS_PAYLOAD, JWT_REFRESH_PAYLOAD } from "../utils/auth/JWTUtils"

export interface User {
	id: number,
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	password: string,
	bio: string,
	avatar_url: string,
	auth_provider: string,
	role: string,
	created_at: string,
	updated_at: string
};

export interface UserPayload {
	id: number,
	username: string
};

export interface CreateUserRequest {
	username: string,
	password: string | null
};

export interface IRegisterRequest {
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	password: string,
};

export interface ISQLCreateUser {
	email: string,
	username: string,
	password?: string,
	first_name: string,
	last_name: string,
	bio?: string,
	avatar_url: string,
	auth_provider: string
};

export interface ILoginRequest {
	username: string,
	password: string
};

export interface ILogoutRequest {
	access_token: string
};

export interface IOAuthLoginRequest {
	code: string
}

export interface IMFATOTPInitRequest {
}

export interface IMFAEmailOTPInitRequest {
}

export interface IMFASMSOTPInitRequest {
	phone: string
}

export interface IMFAVerifyRequest {
	code: string
}

export interface I2FASetupRequest {
	method: string,
	contact: string
}

export interface I2FAConfirmRequest {
	method: string,
	code: string
}

export interface I2FADisableRequest {
	method: string,
	password: string
}

export interface IResetPasswordRequest {
	email: string
}

export interface IResetPasswordVerifyRequest {
	email: string,
	code: string
}

export interface IResetPasswordUpdateRequest {
	email: string,
	code: string,
	newPassword: string
}

export interface IProfileRequest {
	username: string
}

export interface IRelationsRequest {
	user_id: string
}

export interface IStatsRequest {
	username: string
}

export interface IMatchesRequest {
	username: string
}

// export interface RefreshRequest {
// 	username: string,
// 	password: string
// };

export interface AuthenticatedRequest {
	user: UserPayload
}

declare module 'fastify' {
	interface FastifyInstance {
		accessTokenAuth: any,
		refreshTokenAuth: any,
		apiKeyAuth: any,
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
