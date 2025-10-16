import { Database } from "sqlite3";
import { DatabaseQueryError } from "../types/exceptions/database.exceptions";

/**
 * Abstract repository class that provides base patterns for all repositories.
*/

class ARepository {
	// protected db: Database;

	// constructor(db: Database) {
	// 	this.db = db;
	// }

	/**
	 * Unified error handling for database operations.
	 * @param error - The error object thrown by the database operation (SQLITE error).
	 * @param operation - Description of the operation that resulted in the error.
	 */
	protected handleDatabaseError(error: any, operation: string) {
		console.error(`Database error during ${operation}:`, error); // TODO: replace with proper logging

		// here we are checking for specific SQLite error codes

		if (error.message?.includes('SQLITE_CONSTRAINT')) {
			// SQLITE_CONSTRAINT (UNQUE, FOREIGN KEY, NOT NULL, CHECK)
			if (error.message.includes('UNIQUE constraint failed')) {
				throw new DatabaseQueryError(`Unique constraint violation during ${operation}`, { originalError: error });
			} else if (error.message.includes('FOREIGN KEY constraint failed')) {
				throw new DatabaseQueryError(`Foreign key constraint violation during ${operation}`, { originalError: error });
			} else if (error.message.includes('NOT NULL constraint failed')) {
				throw new DatabaseQueryError(`Not null constraint violation during ${operation}`, { originalError: error });
			} else if (error.message.includes('CHECK constraint failed')) {
				throw new DatabaseQueryError(`Check constraint violation during ${operation}`, { originalError: error });
			} else {
				throw new DatabaseQueryError(`Constraint violation during ${operation}`, { originalError: error });
			}
		} else if (error.message?.includes('SQLITE_ERROR')) {
			// SQLITE_ERROR (syntax/query error or missing database)
			throw new DatabaseQueryError(`Query error during ${operation}`, { originalError: error });
		} else if (error.message?.includes('SQLITE_BUSY')) {
			// SQLITE_BUSY (database is busy - one writer at a time)
			throw new DatabaseQueryError(`Database is busy during ${operation}`, { originalError: error });
		} else {
			// Generic database error
			throw new DatabaseQueryError(`Database error during ${operation}`, { originalError: error });
		}
	}
}

export default ARepository;
