import AuthError from "./AAuthError";
import { BadRequestError } from "./AAuthError";

export class AuthChallengeExpired extends BadRequestError {
	constructor(message: string = 'Challenge has expired', details: any = {}) {
		super(message, 'AUTH_CHALLENGE_EXPIRED', details);
	}
}

export class TooManyResendsError extends BadRequestError {
	constructor(message: string = 'Maximum resends reached', details: any = {}) {
		super(message, 'AUTH_TOO_MANY_RESENDS', details);
	}
}

export class TooManyAttemptsError extends BadRequestError {
	constructor(message: string = 'Maximum attempts reached', details: any = {}) {
		super(message,'AUTH_TOO_MANY_ATTEMPTS', details);
	}
}

export class InvalidCodeError extends BadRequestError {
	constructor(message: string = 'Invalid Code', details: any = {}) {
		super(message, 'AUTH_INVALID_CODE', details);
	}
}
