import { InternalServerError } from "./AAuthError";

export class DatabaseQueryError extends InternalServerError {
	constructor(message: string = 'Database query error', details: any = {}) {
		super(message, 'AUTH_DATABASE_QUERY_ERROR', details);
	}
}
