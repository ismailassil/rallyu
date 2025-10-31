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
