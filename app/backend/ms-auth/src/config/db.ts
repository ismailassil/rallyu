import { env } from './env';

export type DBConfig = {
	dbPath: string;
}

export const dbConfig: DBConfig = {
	dbPath: env.SQLITE3_DB_PATH
}