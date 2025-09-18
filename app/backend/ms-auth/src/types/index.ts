import { JetStreamClient } from "nats"
import { JWT_ACCESS_PAYLOAD } from "../utils/auth/Auth"

export interface User {
	id: number,
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	password: string,
	bio: string,
	avatar_path: string,
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
	password: string
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
		requireAuth: any,
		authenticate: any,
		js: JetStreamClient,
		// jsonC: jsoncode,
		nc: any
	}
	interface FastifyRequest {
		user: JWT_ACCESS_PAYLOAD | null,
		// cookies: {
		// 	[cookieName: string]: string
		// }
		// id: string
	}
}

export interface ISessionFingerprint {
	device_name: string,
	browser_version: string,
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
