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

// USERS
export class UserAlreadyExistsError extends AuthError {
	constructor(conflict: string) {
		const msg = `${conflict} already taken`;
		const code = `AUTH_${conflict.toUpperCase()}_TAKEN`;
		super(msg, 409, code);
	}
}
export class UserNotFoundError extends AuthError {
	constructor(message: string = 'User not found') {
		super(message, 404, 'AUTH_USER_NOT_FOUND');
	}
}
export class UsersNotFoundError extends AuthError {
	// where we don't want to reveal which specific user doesn't exist (relations)
	constructor(message: string = 'One or both users do not exist') {
		super(message, 404, 'AUTH_USERS_NOT_FOUND');
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

// 2FA LOGIN CHALLENGE
export class TwoFANotEnabledError extends AuthError {
	constructor(message: string = 'Two Factor Authentication is not enabled', details: any = {}) {
		super(message, 404, 'AUTH_2FA_NOT_ENABLED', details);
	}
}
export class TwoFAAlreadyEnabled extends AuthError {
	constructor(method: string, message: string = '2FA already enabled', details: any = {}) {
		message = `2FA via ${method} is already enabled`;
		super(message, 404, `AUTH_2FA_ALREADY_ENABLED`, details);
	}
}

// export class TwoFAChallengeNotFound extends AuthError {
// 	constructor(message: string = 'Two Factor challenge not found', details: any = {}) {
// 		super(message, 404, 'AUTH_2FA_CHALLENGE_NOT_FOUND', details);
// 	}
// }

// export class TwoFAChallengeMethodNotSelected extends AuthError {
// 	constructor(message: string = 'Two Factor challenge method not selected', details: any = {}) {
// 		super(message, 400, 'AUTH_2FA_CHALLENGE_METHOD_NOT_SELECTED', details);
// 	}
// }

// export class TwoFAChallengeExpired extends AuthError {
// 	constructor(message: string = 'Two Factor challenge has expired', details: any = {}) {
// 		super(message, 400, 'AUTH_2FA_CHALLENGE_EXPIRED', details);
// 	}
// }

export class AuthChallengeExpired extends AuthError {
	constructor(message: string = 'Challenge has expired', details: any = {}) {
		super(message, 400, 'AUTH_CHALLENGE_EXPIRED', details);
	}
}
export class TooManyResendsError extends AuthError {
	constructor(message: string = 'Maximum resends reached', details: any = {}) {
		super(message, 429, 'AUTH_RATE_LIMIT', details);
	}
}
export class TooManyAttemptsError extends AuthError {
	constructor(message: string = 'Maximum attempts reached', details: any = {}) {
		super(message, 429, 'AUTH_RATE_LIMIT', details);
	}
}

// export class TwoFAChallengeMaxResendsReached extends AuthError {
// 	constructor(message: string = 'Two Factor challenge maximum resends reached', details: any = {}) {
// 		super(message, 400, 'AUTH_2FA_CHALLENGE_MAX_RESENDS_REACHED', details);
// 	}
// }

// export class TwoFAChallengeInvalidCode extends AuthError {
// 	constructor(message: string = 'Two Factor challenge invalid code', details: any = {}) {
// 		super(message, 400, 'AUTH_2FA_CHALLENGE_INVALID_CODE', details);
// 	}
// }

// AUTHENTICATION
export class NoEmailIsAssociated extends AuthError {
	constructor(message: string = 'No email is associated with this account', details: any = {}) {
		super(message, 400, 'AUTH_NO_EMAIL_ASSOCIATED', details);
	}
}
export class NoPhoneIsAssociated extends AuthError {
	constructor(message: string = 'No phone number is associated with this account', details: any = {}) {
		super(message, 400, 'AUTH_NO_PHONE_ASSOCIATED', details);
	}
}

export class InvalidCodeError extends AuthError {
	constructor(message: string = 'Invalid Code', details: any = {}) {
		super(message, 400, 'AUTH_INVALID_CODE', details);
	}
}
export class ExpiredCodeError extends AuthError {
	constructor(message: string = 'Code expired', details: any = {}) {
		super(message, 400, 'AUTH_CODE_EXPIRED', details);
	}
}

export class InvalidAuthProviderError extends AuthError {
	constructor(auth_provider: string, message: string = 'Invalid auth provider method', details: any = {}) {
		if (auth_provider === 'Local')
			message = `This account is registered with a password. Please log in with password.`;
		else
			message = `This account is registered with ${auth_provider}`;
		super(message, 401, 'AUTH_INVALID_AUTH_PROVIDER', details);
	}
}

export class InvalidCredentialsError extends AuthError {
	constructor(message: string = 'Invalid username or password', details: any = {}) {
		super(message, 401, 'AUTH_INVALID_CREDENTIALS', details);
	}
}

// SERVER
export class ServiceUnavailable extends AuthError {
	constructor(message: string = 'Authentication service is currently unavailable', details: any = {}) {
		super(message, 503, 'AUTH_SERVICE_UNAVAILABLE', details);
	}
}

export class InternalServerError extends AuthError {
	constructor(message: string = 'An unexpected error occured', details: any = {}) {
		super(message, 500, 'AUTH_INTERNAL_ERROR', details);
	}
}

// 2FA
// export class _2FANotFound extends AuthError {
// 	constructor(method: string, message: string = '2FA not found', details: any = {}) {
// 		message = `2FA via ${method} not found`;
// 		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_NOT_FOUND`, details);
// 	}
// }

// export class _2FANotEnabled extends AuthError {
// 	constructor(method: string, message: string = '2FA not enabled', details: any = {}) {
// 		message = `2FA via ${method} not enabled`;
// 		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_NOT_ENABLED`, details);
// 	}
// }

// export class _2FAAlreadyEnabled extends AuthError {
// 	constructor(method: string, message: string = '2FA already enabled', details: any = {}) {
// 		message = `2FA via ${method} already enabled`;
// 		super(message, 404, `AUTH_2FA_${method.toUpperCase()}_ALREADY_ENABLED`, details);
// 	}
// }

// export class _2FAInvalidCode extends AuthError {
// 	constructor(type: string, message: string = '2FA code is not valid', details: any = {}) {
// 		message = `2FA ${type} verification code is not valid`;
// 		super(message, 400, `AUTH_2FA_BY_${type.toUpperCase()}_INVALID_CODE`, details);
// 	}
// }

// export class _2FAExpiredCode extends AuthError {
// 	constructor(type: string, message: string = '2FA code expired', details: any = {}) {
// 		message = `2FA ${type} verification code expired`;
// 		super(message, 400, `AUTH_2FA_BY_${type.toUpperCase()}_EXPIRED_CODE`, details);
// 	}
// }

// PASSWORD RESET
// export class PasswordResetNotFoundError extends AuthError {
// 	constructor(message: string = 'Password reset request is not found', details: any = {}) {
// 		super(message, 400, 'AUTH_PASSWORD_RESET_EXPIRED', details);
// 	}
// }

// export class PasswordResetExpiredError extends AuthError {
// 	constructor(message: string = 'Password reset request has expired', details: any = {}) {
// 		super(message, 400, 'AUTH_PASSWORD_RESET_EXPIRED', details);
// 	}
// }

// export class PasswordResetInvalidCodeError extends AuthError {
// 	constructor(message: string = 'Invalid password reset code', details: any = {}) {
// 		super(message, 400, 'AUTH_PASSWORD_RESET_INVALID_CODE', details);
// 	}
// }

// RATE LIMIT
export class RateLimitError extends AuthError {
	constructor(message: string = 'Rate limit exceeded', details: any = {}) {
		super(message, 429, 'AUTH_RATE_LIMIT_EXCEEDED', details);
	}
}

// VALIDATION
export class ValidationError extends AuthError {
	constructor(message: string = 'Validation failed', details: any = {}) {
		super(message, 400, 'AUTH_VALIDATION_ERROR', details);
	}
}

// METHOD NOT ALLOWED
export class MethodNotSupportedError extends AuthError {
	constructor(method: string, message: string = 'Method not supported', details: any = {}) {
		super(`Method ${method} is not supported`, 400, 'AUTH_METHOD_NOT_SUPPORTED', details);
	}
}

// RESOURCE NOT FOUND (GENERAL)
export class ResourceNotFoundError extends AuthError {
	constructor(resource: string, message: string = 'Resource not found', details: any = {}) {
		super(message, 404, `AUTH_${resource.toUpperCase()}_NOT_FOUND`, details);
	}
}

// FORBIDDEN ACCESS
export class ForbiddenError extends AuthError {
	constructor(message: string = 'Access forbidden', details: any = {}) {
		super(message, 403, 'AUTH_FORBIDDEN', details);
	}
}

// BAD REQUEST
export class BadRequestError extends AuthError {
	constructor(message: string = 'Bad request', details: any = {}) {
		super(message, 400, 'AUTH_BAD_REQUEST', details);
	}
}

// DATABASE ERRORS
export class DatabaseConnectionError extends AuthError {
	constructor(message: string = 'Database connection error', details: any = {}) {
		super(message, 500, 'AUTH_DATABASE_CONNECTION_ERROR', details);
	}
}

export class DatabaseQueryError extends AuthError {
	constructor(message: string = 'Database query error', details: any = {}) {
		super(message, 500, 'AUTH_DATABASE_QUERY_ERROR', details);
	}
}

export class ResourceConflictError extends AuthError {
	constructor(resource: string, message: string = 'Resource conflict', details: any = {}) {
		super(message, 409, `AUTH_${resource.toUpperCase()}_CONFLICT`, details);
	}
}

// RELATIONS ERRORS
export class CannotSendFriendRequestError extends AuthError {
	constructor(message: string = 'Unable to send friend request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_SEND_FRIEND_REQUEST', details);
	}
}

export class FriendRequestAlreadySentError extends AuthError {
	constructor(message: string = 'Friend request already sent', details: any = {}) {
		super(message, 400, 'AUTH_FRIEND_REQUEST_ALREADY_SENT', details);
	}
}

export class AlreadyFriendsError extends AuthError {
	constructor(message: string = 'Users are already friends', details: any = {}) {
		super(message, 400, 'AUTH_ALREADY_FRIENDS', details);
	}
}

export class NoPendingRequestError extends AuthError {
	constructor(message: string = 'No pending request', details: any = {}) {
		super(message, 400, 'AUTH_NO_PENDING_REQUEST', details);
	}
}

export class CannotCancelRequestError extends AuthError {
	constructor(message: string = 'Cannot cancel request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_CANCEL_REQUEST', details);
	}
}

export class CannotAcceptRequestError extends AuthError {
	constructor(message: string = 'Cannot accept request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_ACCEPT_REQUEST', details);
	}
}

export class CannotRejectRequestError extends AuthError {
	constructor(message: string = 'Cannot reject request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_REJECT_REQUEST', details);
	}
}

export class CannotBlockError extends AuthError {
	constructor(message: string = 'Unable to block user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_BLOCK', details);
	}
}

export class CannotUnblockError extends AuthError {
	constructor(message: string = 'Unable to unblock user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_UNBLOCK', details);
	}
}

export class CannotUnfriendError extends AuthError {
	constructor(message: string = 'Unable to unfriend user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_UNFRIEND', details);
	}
}
