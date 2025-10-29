import AuthError, { BadRequestError, ForbiddenError, UnauthorizedError } from "./AAuthError";

export class TokenRequiredError extends UnauthorizedError {
	constructor(message: string = 'Authentication required', details: any = {}) {
		super(message, 'AUTH_TOKEN_REQUIRED', details);
	}
}

export class TokenInvalidError extends UnauthorizedError {
	constructor(message: string = 'Invalid token', details: any = {}) {
		super(message, 'AUTH_TOKEN_INVALID', details);
	}
}

export class TokenExpiredError extends UnauthorizedError {
	constructor(type:string, details: any = {}) {
		const msg = `${type} token has expired`;
		super(msg, 'AUTH_TOKEN_EXPIRED', details);
	}
}

export class SessionNotFoundError extends UnauthorizedError {
	constructor(message: string = 'Session not found', details: any = {}) {
		super(message, 'AUTH_SESSION_NOT_FOUND', details);
	}
}

export class SessionExpiredError extends UnauthorizedError {
	constructor(message: string = 'Session has expired', details: any = {}) {
		super(message, 'AUTH_SESSION_EXPIRED', details);
	}
}

export class SessionRevokedError extends UnauthorizedError {
	constructor(message: string = 'Session has been revoked', details: any = {}) {
		super(message, 'AUTH_SESSION_REVOKED', details);
	}
}

export class InvalidAuthProviderError extends ForbiddenError {
	constructor(auth_provider: string, message: string = 'Invalid auth provider method', details: any = {}) {
		if (auth_provider === 'Local')
			message = `This account is registered with a password. Please log in with password.`;
		else if (auth_provider === 'Google' || auth_provider === '42')
			message = `This account is registered with ${auth_provider}`;
		super(message, 'AUTH_INVALID_AUTH_PROVIDER', details);
	}
}

export class InvalidCredentialsError extends BadRequestError {
	constructor(message: string = 'Invalid username or password', details: any = {}) {
		super(message, 'AUTH_INVALID_CREDENTIALS', details);
	}
}

export class OAuthFailedError extends BadRequestError {
	constructor(message: string = 'OAuth workflow failed', code: string = 'AUTH_OAUTH_FAILED', details: any = {}) {
		super(message, code, details);
	}
}
