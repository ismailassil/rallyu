import sqlite3 from "sqlite3";

type DatabaseInstance = sqlite3.Database;

class Database {
	private db: DatabaseInstance | null = null;

	async connect(DBFilePath: string) : Promise<void> {
		return new Promise((resolve, reject) => {
			this.db = new sqlite3.Database(DBFilePath,
				sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
				(err) => {
					if (err) {
						console.log(`Error connecting to SQLite Database.`);
						console.log(err);
						return reject(err);
					} else {
						console.log(`Connected to SQLite Database.`);
						resolve();
					}
				});
		});
	}

	async close() : Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.db) {
				this.db.close((err) => {
					if (err) {
						console.log(`Error closing SQLite Database connection.`);
						return reject(err);
					} else {
						this.db = null;
						console.log(`Closed SQLite Database connection.`);
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	}

	async run(sql: string, params: any[] = []) : Promise<{ lastID: number, changes: number }> {
		return new Promise((resolve, reject) => {
			if (!this.db)
				reject(new Error('Database not connected.'));

			this.db?.run(sql, params, function (err) {
				if (err)
					return reject(err);
				resolve({ lastID: this.lastID, changes: this.changes })
			});
		});
	}

	async get<T>(sql: string, params: any[] = []) : Promise<T | any> {
		return new Promise((resolve, reject) => {
			if (!this.db)
				reject(new Error('Database not connected.'));

			this.db?.get(sql, params, (err, row) => {
				if (err)
					return reject(err);
				resolve(row as T);
			});
		});
	}

	async all<T>(sql: string, params: any[] = []) : Promise<T[]> {
		return new Promise((resolve, reject) => {
			if (!this.db)
				reject(new Error('Database not connected.'));

			this.db?.all(sql, params, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows as T[]);
			});
		});
	}
}

export const db = new Database();
