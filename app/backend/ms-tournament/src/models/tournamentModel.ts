import { FastifyInstance } from "fastify";
import sqlite3 from "sqlite3";
import { notifcationTournamentStart, NOTIFY_USER_PAYLOAD, TournamentSchema } from "../types/tournament";

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
            start_date timestamp NOT NULL,
            notified INTEGER DEFAULT 0 NOT NULL,
			cancellation_reason varchar(255)
        );
		CREATE TRIGGER IF NOT EXISTS tournament_finish AFTER UPDATE ON TournamentMatches
			FOR EACH ROW
			WHEN (OLD.stage='final' AND OLD.winner IS NULL AND NEW.stage='final' AND NEW.winner IS NOT NULL)
		BEGIN
			UPDATE ${this.modelName} SET state='finished' WHERE id=NEW.tournament_id;
		END;
		`;
  public cancellation_reason = new Map<string, string>()
  private DB: sqlite3.Database;
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.DB = app.DB;
    this.app = app;

	this.cancellation_reason.set("not-enough-players", "Not enough players to participate");
	this.cancellation_reason.set("match-cancel", "Two players forfeited their match during the tournament");
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
				`INSERT INTO ${this.modelName} (title, host_id, mode, contenders_size, start_date, contenders_joined)
						VALUES (?, ?, ?, ?, ?, ?)`,
				function (err) {
					if (err) reject(err);
					else resolve(this);
				}
			);
		});
  }

	async tournamentAdd({ title, game, date, host_id, hostIn = false }) {
		const statement: sqlite3.Statement = await this.prepareStatement();

		const id: number = await new Promise((resolve, reject) => {
			statement.run(
				title,
				host_id,
				!game ? "ping-pong" : "tic-tac-toe",
				4,
				date,
				hostIn ? 1 : 0,
				function (err: unknown) {
					if (err) reject(err);
					else resolve(this.lastID);
				}
			);
		});

		const data: TournamentSchema = {
			id,
			title,
			start_date: date,
			mode: game,
			contenders_size: 4,
			contenders_joined: hostIn ? 1 : 0,
			host_id,
			notified: 0,
		};

		return data;
	}

	async tournamentGet(id: number): Promise<TournamentSchema> {
		const data: TournamentSchema = await new Promise<TournamentSchema>(
			(resolve, reject) => {
				this.DB.get(
					`SELECT * FROM ${this.modelName} WHERE id=?`,
					[id],
					(err: unknown, row: TournamentSchema) => {
						if (err) reject(err);
						else resolve(row);
					}
				);
			}
		);
		return data;
	}

	async tournamentGetAll(mode: string, search: string) {
		const data: TournamentSchema[] = await new Promise<TournamentSchema[]>(
			(resolve, reject) => {
				if (mode) {
					if (search) {
						this.DB.all(
							`SELECT * FROM ${this.modelName} WHERE title LIKE ? AND mode=? ORDER BY id`,
							[search + "%", mode],
							(err, rows: TournamentSchema[]) => {
								if (err) reject(err);
								else resolve(rows);
							}
						);
					} else {
						this.DB.all(
							`SELECT * FROM ${this.modelName} WHERE (state='pending' OR state='ongoing') AND mode=? ORDER BY id`,
							[mode],
							(err, rows: TournamentSchema[]) => {
								if (err) reject(err);
								else resolve(rows);
							}
						);
					}
				} else {
					if (search) {
						this.DB.all(
							`SELECT * FROM ${this.modelName} WHERE title LIKE ? ORDER BY id DESC`,
							[search + "%"],
							(err, rows: TournamentSchema[]) => {
								if (err) reject(err);
								else resolve(rows);
							}
						);
					} else {

						this.DB.all(
							`SELECT * FROM ${this.modelName} WHERE (state='pending' OR state='ongoing') ORDER BY id DESC`,
							(err, rows: TournamentSchema[]) => {
								if (err) reject(err);
								else resolve(rows);
							}
						);
					}
				}
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
		setInterval(async () => {
			const now = (new Date(Date.now() + (1000 * 60 * 60)));

			const strDate = `${now.getFullYear()}-${(now.getMonth() + 1)
							.toString()
							.padStart(2, "0")}-${now.getDate()
							.toString()
							.padStart(2, "0")}T${(now.getHours())
							.toString()
							.padStart(2, "0")}:${now.getMinutes()
							.toString()
							.padStart(2, "0")}`;

			console.log(strDate)
			console.log(strDate)
			// Change state of tournaments to ongoing
			this.DB.run(
				`
				UPDATE ${this.modelName} SET state='ongoing' WHERE start_date<='${strDate}' AND 
				state='pending' AND contenders_size=contenders_joined
				`,
				(err) => {
					console.log(err);
				}
			);

			// Change uncompleted tournament to cancelled
			this.DB.run(
				`
				UPDATE ${this.modelName} SET state='cancelled', cancellation_reason=? WHERE start_date<='${strDate}' AND 
				state='pending' AND contenders_size<>contenders_joined
				`,
				[this.cancellation_reason.get("not-enough-players")],
				(err) => {
					console.log(err);
				}
			);
			
			
			// NOTIFY USERS THAT THE TOURNAMENT HAS STARTED
			const tournaments: notifcationTournamentStart[] =
				await new Promise<notifcationTournamentStart[]>((resolve, reject) => {
					this.DB.all(`SELECT t.id, t.host_id, m.player_1, m.player_2
						FROM TournamentMatches AS m INNER JOIN ${this.modelName} AS t
						ON m.tournament_id=t.id
						WHERE t.state='ongoing' AND t.notified=0 AND m.stage='semifinal'`,
						(err, rows: notifcationTournamentStart[]) => {
							if (err) reject(err);
							else resolve(rows);
						}
					);
				});
			
			let tournament_id = -1;
			for (const tournament of tournaments) {
				
				this.app.js.publish("notification.dispatch", this.app.jsonCodec.encode({
					senderId: tournament.host_id,
					receiverId: tournament.player_1,
					type: "tournament",
					actionUrl: `/tournament/stage/${tournament.id}`
				} as NOTIFY_USER_PAYLOAD));

				this.app.js.publish("notification.dispatch", this.app.jsonCodec.encode({
					senderId: tournament.host_id,
					receiverId: tournament.player_2,
					type: "tournament",
					actionUrl: `/tournament/stage/${tournament.id}`
				} as NOTIFY_USER_PAYLOAD));
				
				this.DB.run(`UPDATE ${this.modelName} SET notified=1 WHERE id=?`, [tournament.id]);
				
				// Set tournamentMatchesTimer
				if (tournament_id !== tournament.id) {
					this.DB.run(`
						UPDATE TournamentMatches SET start_time=datetime('now', 'localtime')
						WHERE tournament_id=? AND stage='semifinal'`,
						[tournament.id]
					);
				}
				tournament_id = tournament.id;
			}

		}, 1000 * 10);
	}
}

const initTournamentModel = async function (app: FastifyInstance) {
	try {
		const tournamentModel = new TournamentModel(app); 
		await tournamentModel.init();

		app.tournamentModel = tournamentModel;
	} catch (err) {
		console.log(err);
	}
};

export { TournamentModel, initTournamentModel };
