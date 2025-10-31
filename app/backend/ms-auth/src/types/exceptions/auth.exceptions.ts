import { BadRequestError } from "./AAuthError";

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
