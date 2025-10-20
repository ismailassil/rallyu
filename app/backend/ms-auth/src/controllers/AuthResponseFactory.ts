import { TokenExpiredError } from "jsonwebtoken";
import { ErrorResponse, SuccessResponse } from "../types";
import { AuthError } from "../types/exceptions/AAuthError";

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
							message: 'Something went wrong. Try again later.',
							details: isDevelopment ? (error as AuthError).details : {}
						}
					}
				};
		}
	}

	static getSuccessResponse(statusCode: number, data?: any) : { status: number, body: SuccessResponse } {
		return {
			status: statusCode,
			body: { success: true, data: data ?? {} }
		};
	}
}

export default AuthResponseFactory;
