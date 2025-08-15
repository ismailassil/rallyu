export abstract class AuthError extends Error {
	public readonly statusCode: number;
	public readonly errorCode: string;
	public readonly details: string;
	public readonly timestamp: string;

	constructor(message: string, statusCode: number, errorCode: string, details: any = {}) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.details = details;
		this.timestamp = new Date().toISOString();
	}
}

// FORM (REGISTER)
export class FormError extends AuthError {
	constructor(message: string = 'Invalid form values', details: any = {}) {
		super(message, 400, 'AUTH_FORM_INVALID', details);
	}
}

export class FormFieldMissing extends AuthError {
	public readonly field: string;

	constructor(field: string, details: any = {}) {
		super(`${field} is required`, 400, `AUTH_${field.toUpperCase()}_REQUIRED`, details);
		this.field = field;
	}
}

export class UsernameLengthError extends AuthError {
	constructor(message: string = 'Username must be between 4-20 characters') {
		super(message, 400, 'AUTH_USERNAME_LENGTH');
	}
}

export class PasswordLengthError extends AuthError {
	constructor(message: string = 'Password must be at least 8 characters') {
		super(message, 400, 'AUTH_PASS_LENGTH');
	}
}

export class WeakPasswordError extends AuthError {
	constructor(message: string = 'Password must contain at least one uppercase letter, one lowercase letter, and one number') {
		super(message, 400, 'AUTH_WEAK_PASSWORD');
	}
}

// USER REGISTRATION
export class UserAlreadyExistsError extends AuthError {
	constructor(conflict: string) {
		const msg = `${conflict} already taken`;
		const code = `AUTH_${conflict.toUpperCase()}_TAKEN`;
		super(msg, 409, code);
	}
}

export class UserNotFoundError extends AuthError { // haven't used it yet
	constructor(message: string = 'User not found') {
		super(message, 404, 'AUTH_USER_NOT_FOUND');
	}
}

// TOKENS
export class TokenRequiredError extends AuthError {
	constructor(message: string = 'Authentication required', details: any = {}) {
		super(message, 401, 'AUTH_TOKEN_REQUIRED', details);
	}
}

export class TokenInvalidError extends AuthError {
	constructor(message: string = 'Invalid token', details: any = {}) {
		super(message, 401, 'AUTH_TOKEN_INVALID', details);
	}
}

export class TokenExpiredError extends AuthError {
	constructor(type:string, details: any = {}) {
		const msg = `${type} token has expired`;
		super(msg, 401, 'AUTH_TOKEN_EXPIRED', details);
	}
}

// SESSIONS
export class SessionNotFoundError extends AuthError {
	constructor(message: string = 'Session not found', details: any = {}) {
		super(message, 401, 'AUTH_SESSION_NOT_FOUND', details);
	}
}

export class SessionExpiredError extends AuthError {
	constructor(message: string = 'Session has expired', details: any = {}) {
		super(message, 401, 'AUTH_SESSION_EXPIRED', details);
	}
}

export class SessionRevokedError extends AuthError {
	constructor(message: string = 'Session has been revoked', details: any = {}) {
		super(message, 401, 'AUTH_SESSION_REVOKED', details);
	}
}

// AUTHENTICATION
export class InvalidCredentialsError extends AuthError {
	constructor(message: string = 'Invalid username or password', details: any = {}) {
		super(message, 401, 'AUTH_INVALID_CREDENTIALS', details);
	}
}
// account locked, disabled, banned, verified
export class InternalServerError extends AuthError {
	constructor(message: string = 'An unexpected error occured', details: any = {}) {
		super(message, 500, 'AUTH_INTERNAL_ERROR', details);
	}
}

// AUTHORIZATION
	// RBAC

// 2FA
// export class _2FARequired extends AuthError {
// 	constructor(method: string, message: string = '2FA is required', details: any = {}) {
// 		message = `2FA via ${method} not found`;
// 		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_NOT_FOUND`, details);
// 	}
// }

export class _2FANotFound extends AuthError {
	constructor(method: string, message: string = '2FA not found', details: any = {}) {
		message = `2FA via ${method} not found`;
		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_NOT_FOUND`, details);
	}
}

export class _2FANotEnabled extends AuthError {
	constructor(method: string, message: string = '2FA not enabled', details: any = {}) {
		message = `2FA via ${method} not enabled`;
		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_NOT_ENABLED`, details);
	}
}

export class _2FAAlreadyEnabled extends AuthError {
	constructor(method: string, message: string = '2FA already enabled', details: any = {}) {
		message = `2FA via ${method} already enabled`;
		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_ALREADY_ENABLED`, details);
	}
}

export class _2FAInvalidCode extends AuthError {
	constructor(type: string, message: string = '2FA code is not valid', details: any = {}) {
		message = `2FA ${type} is not valid`;
		super(message, 400, `AUTH_2FA_${type.toUpperCase()}_INVALID_CODE`, details);
	}
}

// PASSWORD RESET

// RATE LIMIT

