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

// HTTP 401 Unauthorized
export class UnauthorizedError extends AuthError {
	constructor(message: string = 'Unauthorized', code: string = 'AUTH_UNAUTHORIZED', details: any = {}) {
		super(message, 401, code, details);
	}
}

// HTTP 403 Forbidden
export class ForbiddenError extends AuthError {
	constructor(message: string = 'Forbidden', code: string = 'AUTH_FORBIDDEN', details: any = {}) {
		super(message, 403, code, details);
	}
}

// HTTP 404 Not Found
export class NotFoundError extends AuthError {
	constructor(message: string = 'Resource not found', code: string = 'AUTH_NOT_FOUND', details: any = {}) {
		super(message, 404, code, details);
	}
}

// HTTP 400 Bad Request
export class BadRequestError extends AuthError {
	constructor(message: string = 'Bad request', code: string = 'AUTH_BAD_REQUEST', details: any = {}) {
		super(message, 400, code, details);
	}
}

// HTTP 409 Conflict
export class ConflictError extends AuthError {
	constructor(message: string = 'Resource conflict', code: string = 'AUTH_RESOURCE_CONFLICT', details: any = {}) {
		super(message, 409, code, details);
	}
}

// HTTP 429 Rate Limit
export class RateLimitError extends AuthError {
	constructor(message: string = 'Rate limit exceeded', details: any = {}) {
		super(message, 429, 'AUTH_RATE_LIMIT_EXCEEDED', details);
	}
}

// HTTP 500 Internal Server Error
export class InternalServerError extends AuthError {
	constructor(message: string = 'Internal server error', code: string = 'AUTH_INTERNAL_ERROR', details: any = {}) {
		super(message, 500, code, details);
	}
}

// HTTP 503 Service Unavailable
export class ServiceUnavailableError extends AuthError {
	constructor(message: string = 'Service unavailable', details: any = {}) {
		super(message, 503, 'AUTH_SERVICE_UNAVAILABLE', details);
	}
}

export default AuthError;
