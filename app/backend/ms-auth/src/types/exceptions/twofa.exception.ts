import { BadRequestError } from "./AAuthError";

export class TwoFANotEnabledError extends BadRequestError {
	constructor(message: string = 'Two Factor Authentication is not enabled', details: any = {}) {
		super(message, 'AUTH_2FA_NOT_ENABLED', details);
	}
}

export class TwoFAAlreadyEnabled extends BadRequestError {
	constructor(method: string, message: string = '2FA already enabled', details: any = {}) {
		message = `2FA via ${method} is already enabled`;
		super(message,`AUTH_2FA_ALREADY_ENABLED`, details);
	}
}
