import AuthError from "./AAuthError";
import { BadRequestError, ConflictError, NotFoundError } from "./AAuthError";

export class UserAlreadyExistsError extends ConflictError {
	constructor(conflictedField: string, details: any = {}) {
		const message = `${conflictedField} already taken`;
		super(message, `AUTH_${conflictedField.toUpperCase()}_TAKEN`, details);
	}
}
export class UserNotFoundError extends NotFoundError {
	constructor(message: string = 'User not found', details: any = {}) {
		super(message, 'AUTH_USER_NOT_FOUND', details);
	}
}
export class UsersNotFoundError extends NotFoundError {
	// where we don't want to reveal which specific user doesn't exist (relations)
	constructor(message: string = 'One or both users do not exist', details: any = {}) {
		super(message, 'AUTH_USERS_NOT_FOUND', details);
	}
}
export class NoEmailIsAssociated extends BadRequestError {
	constructor(message: string = 'No email is associated with this account', details: any = {}) {
		super(message, 'AUTH_NO_EMAIL_ASSOCIATED', details);
	}
}
export class NoPhoneIsAssociated extends BadRequestError {
	constructor(message: string = 'No phone number is associated with this account', details: any = {}) {
		super(message, 'AUTH_NO_PHONE_ASSOCIATED', details);
	}
}
