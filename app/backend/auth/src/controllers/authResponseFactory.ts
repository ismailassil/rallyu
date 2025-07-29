import { TokenExpiredError } from "jsonwebtoken";
import { ErrorResponse, SuccessResponse } from "../types";
import { AuthError, InvalidCredentialsError, PasswordLengthError, SessionExpiredError, SessionNotFoundError, SessionRevokedError, TokenInvalidError, TokenRequiredError, UserAlreadyExistsError, UserNotFoundError, UsernameLengthError, WeakPasswordError, _2FANotFound, _2FANotEnabled, _2FAAlreadyEnabled, _2FAInvalidCode } from "../types/auth.types";

// export interface ErrorResponse {
// 	success: boolean,
// 	error: {
// 		code: string;
// 		message: string;
// 		details?: any;
// 	}
// }

class AuthResponseFactory {

	static getErrorResponse(error: Error, isDevelopment: boolean = true) : { status: number, body: ErrorResponse } {
		console.error(`Auth Error: `, {
			type: error.name,
			message: error.message,
			code: (error as AuthError).errorCode,
			details: (error as AuthError).details
		});

		switch(true) {
			case error instanceof AuthError:
				return {
					status: error.statusCode,
					body: {
						success: false,
						error: {
							code: error.errorCode,
							message: error.message,
							details: isDevelopment ? error.details : {}
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
							details: isDevelopment ? (error as AuthError).details : {}
						}
					}
				};
		}
	}

	static getSuccessResponse(statusCode: number, data?: any) : { status: number, body: SuccessResponse } {
		console.log(`Auth Success: `, {
			data
		});

		return {
			status: statusCode,
			body: { success: true, data: data ?? null }
		}
	}
}

export default AuthResponseFactory;