import { Database } from "sqlite3";
import { DatabaseQueryError } from "../types/exceptions/database.exceptions";
import logger from "../utils/misc/logger";

/**
 * Abstract repository class that provides base patterns for all repositories.
*/

class ARepository {
	/**
	 * Unified error handling for database operations.
	 * @param error - The error object thrown by the database operation (SQLITE error).
	 * @param operation - Description of the operation that resulted in the error.
	 */
	protected handleDatabaseError(error: any, operation: string) {
		const parsed = this.parseSQLite3ErrorObject(error);

		logger.error({ error, parsed }, `[DATABASE] Database error during ${operation}`);

		// here we are checking for specific SQLite error codes

		if (error.message?.includes('SQLITE_CONSTRAINT')) {
			// SQLITE_CONSTRAINT (UNQUE, FOREIGN KEY, NOT NULL, CHECK)
			if (error.message.includes('UNIQUE constraint failed')) {
				throw new DatabaseQueryError(`Unique constraint violation during ${operation}`, { error: parsed, originalError: error });
			} else if (error.message.includes('FOREIGN KEY constraint failed')) {
				throw new DatabaseQueryError(`Foreign key constraint violation during ${operation}`, { error: parsed, originalError: error });
			} else if (error.message.includes('NOT NULL constraint failed')) {
				throw new DatabaseQueryError(`Not null constraint violation during ${operation}`, { error: parsed, originalError: error });
			} else if (error.message.includes('CHECK constraint failed')) {
				throw new DatabaseQueryError(`Check constraint violation during ${operation}`, { error: parsed, originalError: error });
			} else {
				throw new DatabaseQueryError(`Constraint violation during ${operation}`, { error: parsed, originalError: error });
			}
		} else if (error.message?.includes('SQLITE_ERROR')) {
			// SQLITE_ERROR (syntax/query error or missing database)
			throw new DatabaseQueryError(`Query error during ${operation}`, { error: parsed, originalError: error });
		} else if (error.message?.includes('SQLITE_BUSY')) {
			// SQLITE_BUSY (database is busy - one writer at a time)
			throw new DatabaseQueryError(`Database is busy during ${operation}`, { error: parsed, originalError: error });
		} else {
			// Generic database error
			throw new DatabaseQueryError(`Database error during ${operation}`, { error: parsed, originalError: error });
		}
	}

	private parseSQLite3ErrorObject(error: any) {
		const code = error.code;
		const errno = error.errno;
		const message = error.message;

		let table: string | null = null;
		let column: string | null = null;

		// UNIQUE constraint
		const uniqueMatch = message.match(/UNIQUE constraint failed: (\w+)\.(\w+)/);
		if (uniqueMatch) {
			table = uniqueMatch[1];
			column = uniqueMatch[2];
		}

		// FOREIGN KEY constraint
		const fkMatch = message.match(/FOREIGN KEY constraint failed: (\w+)\.(\w+)/);
		if (fkMatch) {
			table = fkMatch[1];
			column = fkMatch[2];
		}

		// NOT NULL constraint
		const notNullMatch = message.match(/NOT NULL constraint failed: (\w+)\.(\w+)/);
		if (notNullMatch) {
			table = notNullMatch[1];
			column = notNullMatch[2];
		}

		// CHECK constraint
		const checkMatch = message.match(/CHECK constraint failed: (\w+)\.(\w+)/);
		if (checkMatch) {
			table = checkMatch[1];
			column = checkMatch[2];
		}

		return { code, errno, message, table, column };
	}

}

export default ARepository;
