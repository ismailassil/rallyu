import { TokenExpiredError } from "jsonwebtoken";
import { ErrorResponse } from "../types";
import { AuthError, InvalidCredentialsError, PasswordLengthError, SessionExpiredError, SessionNotFoundError, SessionRevokedError, TokenInvalidError, TokenRequiredError, UserAlreadyExistsError, UserNotFoundError, UsernameLengthError, WeakPasswordError, _2FANotFound, _2FANotEnabled, _2FAAlreadyEnabled, _2FAInvalidCode } from "../types/auth.types";

// export interface ErrorResponse {
// 	success: boolean,
// 	error: {
// 		code: string;
// 		message: string;
// 		details?: any;
// 	}
// }

class AuthErrorHandler {

	static handle(error: Error, isDevelopment: boolean = false) : { status: number, body: ErrorResponse } {
		console.log(`Auth Error: `, {
			type: error.name,
			message: error.message,
			code: (error as AuthError).errorCode,
			details: (error as AuthError).details
		});

		switch(true) {
			case error instanceof UsernameLengthError:
			case error instanceof PasswordLengthError:
			case error instanceof WeakPasswordError:
				return {
					status: (error as AuthError).statusCode,
					body: {
						success: false,
						error: {
							code: (error as AuthError).errorCode,
							message: error.message,
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
			
			case error instanceof UserAlreadyExistsError:
				return {
					status: (error as AuthError).statusCode,
					body: {
						success: false,
						error: {
							code: (error as AuthError).errorCode,
							message: error.message,
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
				
			case error instanceof InvalidCredentialsError:
			case error instanceof UserNotFoundError:
				return {
					status: 401,
					body: {
						success: false,
						error: {
							code: 'AUTH_INVALID_CREDENTIALS',
							message: 'Invalid username or password',
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
				
			case error instanceof TokenRequiredError:
			case error instanceof TokenInvalidError:
			case error instanceof TokenExpiredError:
				return {
					status: (error as AuthError).statusCode,
					body: {
						success: false,
						error: {
							code: (error as AuthError).errorCode,
							message: error.message,
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
				
			case error instanceof SessionNotFoundError:
			case error instanceof SessionExpiredError:
			case error instanceof SessionRevokedError:
				return {
					status: (error as AuthError).statusCode,
					body: {
						success: false,
						error: {
							code: (error as AuthError).errorCode,
							message: error.message,
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
			
			case error instanceof _2FANotFound:
			case error instanceof _2FANotEnabled:
			case error instanceof _2FAAlreadyEnabled:
			case error instanceof _2FAInvalidCode:
				return {
					status: (error as AuthError).statusCode,
					body: {
						success: false,
						error: {
							code: (error as AuthError).errorCode,
							message: error.message,
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
			
			default:
				return {
					status: 500,
					body: {
						success: false,
						error: {
							code: 'AUTH_INTERNAL_ERROR',
							message: isDevelopment ? error.message : 'An unexpected error occured',
							details: isDevelopment ? {} : (error as AuthError).details
						}
					}
				};
		}
	}
}

export default AuthErrorHandler;