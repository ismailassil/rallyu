import { FastifyInstance } from "fastify";
import app from "../app";
import sqlite3 from "sqlite3";
import { chownSync } from "fs";

interface TournamentSchema {
  id: number;
  title: string;
  host_id: number;
  mode: string;
  contenders_size: number;
  contenders_joined: number;
  state?: string;
  access: string;
  start_date: string;
}

declare module "fastify" {
  interface FastifyInstance {
    tournamentModel: TournamentModel;
  }
}

class TournamentModel {
  private modelName = "Tournaments";
  private sqlQuery = `
  		CREATE TABLE IF NOT EXISTS ${this.modelName} (
            id INTEGER UNIQUE NOT NULL PRIMARY KEY,
            title varchar(255) NOT NULL,
            host_id INTEGER NOT NULL,
            mode varchar(255) NOT NULL,
            contenders_size INTEGER DEFAULT 4 NOT NULL,
            contenders_joined INTEGER DEFAULT 0 NOT NULL,
			state varchar(255) DEFAULT pending NOT NULL,
            access varchar(255) NOT NULL,
            start_date timestamp NOT NULL
        );
		CREATE TRIGGER IF NOT EXISTS tournament_finish AFTER UPDATE ON TournamentMatches
			FOR EACH ROW
			WHEN (OLD.stage='final' AND OLD.results IS NULL AND NEW.results IS NOT NULL)
		BEGIN
			UPDATE ${this.modelName} SET state='finished' WHERE id=NEW.tournament_id;
		END;
		`;
  private DB: sqlite3.Database;
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.DB = app.DB;
    this.app = app;
  }

	async init() {
		return new Promise((resolve, reject) => {
			this.DB.exec(this.sqlQuery, (err) => {
				if (err) reject(err);
				else resolve(this);
			});
		});
	}

	async prepareStatement() {
		return new Promise<sqlite3.Statement>((resolve, reject) => {
				this.DB.prepare(
				`INSERT INTO ${this.modelName} (title, host_id, mode, contenders_size, access, start_date)
						VALUES (?, ?, ?, ?, ?, ?)`,
				function (err) {
					if (err) reject(err);
					else resolve(this);
				}
			);
		});
  }

	async tournamentAdd({ title, game, access, date, host_id }) {
		const statement: sqlite3.Statement = await this.prepareStatement();

		const id: number = await new Promise((resolve, reject) => {
			statement.run(
				title,
				host_id,
				!game ? "ping-pong" : "tic-tac-toe",
				4,
				!access ? "public" : "private",
				date,
				function (err: unknown) {
					if (err) reject(err);
					else resolve(this.DB);
				}
			);
		});

		const data: TournamentSchema = {
			id,
			access,
			title,
			start_date: date,
			mode: game,
			contenders_size: 4,
			contenders_joined: 0,
			host_id,
		};

		return data;
	}

	async tournamentGet(id: number) {
		const data = await new Promise(
			(resolve, reject) => {
				this.DB.get(
					`SELECT * FROM ${this.modelName} WHERE id=?`,
					[id],
					(err, rows) => {
					if (err) reject(err);
					else resolve(rows);
					}
				);
			}
		);
		return data;
	}

	async tournamentGetAll(limit: number) {
		const data: TournamentSchema = await new Promise<TournamentSchema>(
			(resolve, reject) => {
			this.DB.all(
				`SELECT * FROM ${this.modelName} WHERE state='pending' LIMIT ?`,
				[limit],
				(err, rows: TournamentSchema) => {
				if (err) reject(err);
				else resolve(rows);
				}
			);
			}
		);

		return data;
	}

	async tournamentUpdateSize(type: string, id: number) {
		await new Promise<unknown>((resolve, reject) => {
			this.DB.run(
				`UPDATE ${this.modelName} SET contenders_joined=contenders_joined${ type === "add" ? "+" : "-" }1 WHERE id=?`,
				[id],
				(err) => {
					if (err) reject(err)
					else resolve(this)
				}
			)
		});
	}

	startTournaments() {
		setInterval(() => {
			const now = (new Date()).toISOString();
			// const data = await new Promise((resolve, reject) => {
			// 	this.DB.run(`UPDATE ${this.modelName} SET state='ongoing' WHERE start_date<='${now}' AND state='pending'`, 
			// 		(err) => err ? reject(err) : resolve(null));
			// });
			// this.DB.run("UPDATE Tournaments SET start_date=?", [now])
			this.DB.run(`UPDATE ${this.modelName} SET state='ongoing' WHERE start_date<='${now}' AND state='pending'`,
				(err) => {
					console.log(err);
				}
			);
			console.log("Interval for tournament state");

			// NOTIFY USERS THAT THE TOURNAMENT HAS STARTED
		}, 1000 * 10);
	}
}

const initTournamentModel = async function (app: FastifyInstance) {
	try {
		const tournamentModel = new TournamentModel(app); 
		await tournamentModel.init();
		// await tournamentModel.tournamentGet();
		// await tournamentModel.tournamentAdd();

		app.tournamentModel = tournamentModel;
	} catch (err) {
		console.log(err);
	}
};

export { TournamentSchema, initTournamentModel };
