import { InternalServerError } from "./AAuthError";

export class DatabaseConnectionError extends InternalServerError {
	constructor(message: string = 'Database connection error', details: any = {}) {
		super(message, 'AUTH_DATABASE_CONNECTION_ERROR', details);
	}
}

export class DatabaseQueryError extends InternalServerError {
	constructor(message: string = 'Database query error', details: any = {}) {
		super(message, 'AUTH_DATABASE_QUERY_ERROR', details);
	}
}
