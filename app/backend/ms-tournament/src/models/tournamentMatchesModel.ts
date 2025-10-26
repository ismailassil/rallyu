import { FastifyInstance } from "fastify";
import app from "../app";
import sqlite3 from "sqlite3";
import { TournamentMatchesSchema } from "../types/tournament";

class TournamentMatchesModel {
	private modelName = "TournamentMatches";
	private sqlQuery = `
			CREATE TABLE IF NOT EXISTS ${this.modelName} (
				id INTEGER UNIQUE NOT NULL PRIMARY KEY,
				tournament_id INTEGER NOT NULL,
				player_1 INTEGER,
				player_2 INTEGER,
				player_1_ready INTEGER DEFAULT 0 NOT NULL,
				player_2_ready INTEGER DEFAULT 0 NOT NULL,
				winner INTEGER,
				results varchar(255),
				stage varchar(255) NOT NULL,
				stage_number INTEGER NOT NULL,
				start_time varchar(255) DEFAULT NULL,
				match_id INTEGER DEFAULT NULL,
				FOREIGN KEY (tournament_id) REFERENCES Tournaments(id)
        	);
			CREATE TRIGGER IF NOT EXISTS tournament_progress AFTER UPDATE ON TournamentMatches
					FOR EACH ROW
					WHEN (NEW.stage='semifinal' AND OLD.winner IS NULL AND NEW.winner IS NOT NULL)
				BEGIN
					UPDATE ${this.modelName}
					SET player_1 = CASE WHEN NEW.stage_number=1 THEN NEW.winner ELSE player_1 END,
      					player_2 = CASE WHEN NEW.stage_number=2 THEN NEW.winner ELSE player_2 END
	  				WHERE stage='final' AND tournament_id=NEW.tournament_id;
				END;

			CREATE TRIGGER IF NOT EXISTS start_time_final_match AFTER UPDATE ON ${this.modelName}
				FOR EACH ROW
					WHEN (
						(OLD.player_1 IS NULL OR OLD.player_2 IS NULL) AND
						NEW.player_1 IS NOT NULL AND
						NEW.player_2 IS NOT NULL
					)
				BEGIN
					UPDATE ${this.modelName} SET start_time=datetime('now', 'localtime') WHERE id=NEW.id AND stage='final';
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
      this.DB.exec(this.sqlQuery, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  async promisifiedInsert(tournament_id, stage, stage_num, hostId: number = -1) {
    return new Promise((resolve, reject) => {
		if (hostId >= 0) {
			this.DB.run(
				"INSERT INTO TournamentMatches (tournament_id, stage, stage_number, player_1) VALUES (?, ?, ?, ?)",
				[tournament_id, stage, stage_num, hostId],
				(err) => {
					if (err) reject(err);
					else resolve(this);
				}
			);
			return ;
		}

		this.DB.run(
			"INSERT INTO TournamentMatches (tournament_id, stage, stage_number) VALUES (?, ?, ?)",
			[tournament_id, stage, stage_num],
			(err) => {
			if (err) reject(err);
			else resolve(this);
			}
		);
    });
  }

  async createTournamentMatches(tournament_id: number, hostIn: boolean = false, hostId: number) {
    try {
		if (!hostIn)
			await Promise.all([
				this.promisifiedInsert(tournament_id, "semifinal", 1),
				this.promisifiedInsert(tournament_id, "semifinal", 2),
				this.promisifiedInsert(tournament_id, "final", 1),
			]);
		else
			await Promise.all([
				this.promisifiedInsert(tournament_id, "semifinal", 1, hostId),
				this.promisifiedInsert(tournament_id, "semifinal", 2),
				this.promisifiedInsert(tournament_id, "final", 1),
			]);
    } catch(err) {
        console.log(err);
    }
  }

  async matchesGet(tournament_id: number) {
    const data = await new Promise(
      (resolve, reject) => {
        this.DB.all(
          `SELECT m.*, t.state FROM ${this.modelName} AS m INNER JOIN Tournaments AS t ON m.tournament_id=t.id WHERE tournament_id=?`,
          [tournament_id],
          (err: Error, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      }
    );
    return data;
  }

    async playerJoinMatch(id: number, player_id: number, player_place: number) {
        await new Promise((resolve, reject) => {
            this.DB.run(`UPDATE ${this.modelName}
                SET player_${player_place}=? WHERE id=?`,
                [player_id, id],
                (err) => {
                    if (err) reject(err)
                        else resolve(this)
                })
        });
    }

    async playerLeaveMatch(id: number, player_place: number) {
        await new Promise((resolve, reject) => {
            this.DB.run(`UPDATE ${this.modelName}
                SET player_${player_place}=null WHERE id=?`,
                [id],
                (err) => {
                    if (err) reject(err)
                        else resolve(this)
                })
        });
    }

    async playerReadyMatch(id: number, playerId: number) {
        await new Promise((resolve, reject) => {
			this.DB.run(`UPDATE ${this.modelName}
				SET
					player_1_ready = CASE WHEN player_1=? THEN 
						CASE WHEN player_1_ready=1 THEN 0 ELSE 1 END
						ELSE player_1_ready
					END,
					player_2_ready = CASE WHEN player_2=? THEN 
						CASE WHEN player_2_ready=1 THEN 0 ELSE 1 END
						ELSE player_2_ready
					END
				WHERE id = ? AND match_id IS NULL`,
				[playerId, playerId, id],
				(err) => {
					if (err) reject(err)
						else resolve(null)
				});
        });
    }

    async getMatchRoomId(id: number) {
        return (await new Promise((resolve, reject) => {
			this.DB.get(`SELECT match_id FROM ${this.modelName} WHERE id = ?`,
				[id],
				(err, rows) => {
					if (err) reject(err)
						else resolve(rows)
				});
        }))
    }

	async monitorReadyMatches() {
		setInterval(async () => {
			try {
				const data: any = await new Promise((resolve, reject) => {
					this.DB.all(`SELECT m.player_1, m.player_2, m.id, t.mode FROM ${this.modelName} AS m
								INNER JOIN Tournaments AS t ON m.tournament_id=t.id
								WHERE m.player_1_ready=1 AND m.player_2_ready=1 AND m.results IS NULL AND m.match_id IS NULL`,
						[],
						(err, rows) => !err ? resolve(rows) : reject(err)
					);
				});

				console.log("===========")
				console.log(data);
				console.log("===========")
			
				data.forEach(async (match: any) => {
					const game_room = await fetch(`http://ms-game:${process.env.MS_GAME_PORT ?? '5010'}/game/room/create`, 
						{
							method: "POST",
							body: JSON.stringify({
								playersIds: [match.player_1, match.player_2],
								gameType: match.mode === "ping-pong" ? "pingpong" : "tictactoe",
								tournament: {
									gameId: match.id
								}
							}),
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer acb7e300b5f196fd19ed978e32d3bf60365f0186fa420de7624aa14eaa90d143`
							}
						}
					);
					// Unauthorized ms-game 3andak tansah
					if (!game_room.ok) {
						throw new Error("Something went wrong")
					}

					const data = await game_room.json();
					
					if (!data || !data.roomId) {
						throw new Error('Game room created but no roomId returned');
					}
					
					this.DB.run(`UPDATE ${this.modelName} SET match_id=? WHERE id=?`,
						[data.roomId, match.id],
						(err) => app.log.fatal(err)
					)
				});
			} catch (err) {
				app.log.fatal(err);
			}
		}, 1000 * 10);
    }

	async progressMatchTournament(data) {
		const res = await new Promise((resolve, reject) => {
			this.DB.run(`UPDATE ${this.modelName} SET winner=?, results=? WHERE id=?`,
				[data.winner, data.id, data.results],
				(err) => err ? reject(err) : resolve(this.DB)
			);
		});
		return (res);
	}

	async monitorTimeoutMatches() {
		setInterval(async () => {
			const matches: TournamentMatchesSchema [] = await new Promise<TournamentMatchesSchema []>((resolve, reject) => {
				this.DB.all(`SELECT * FROM ${this.modelName}
					WHERE results IS NULL AND start_time IS NOT NULL AND datetime('now', 'localtime')>=datetime(start_time, '+5 minutes')`,
					[],
					(err, rows: TournamentMatchesSchema []) => err ? reject(err) : resolve(rows)
				);
			});

			for (const match of matches) {
				if (!match.player_1_ready && !match.player_2_ready) {
					this.DB.run(`UPDATE ${this.modelName} SET results='F|F' WHERE id=?`, [match.id], (err) => app.log.fatal(err));

					this.DB.run(
						`UPDATE Tournaments SET state='cancelled', cancellation_reason=? WHERE id=? AND state='ongoing'`,
						[this.app.tournamentModel.cancellation_reason.get('match-cancel'), match.tournament_id],
						(err) => app.log.fatal(err)
					);
					continue ;
				}
				if (match.player_1_ready && match.player_2_ready)
					continue ;

				const winner = match.player_1_ready ? 1 : 2;
				this.DB.run(
					`UPDATE ${this.modelName} SET winner=?, results=? WHERE id=?`,
					[winner === 1 ? match.player_1 : match.player_2, winner === 1 ? "7|F" : "F|7", match.id],
					(err) => app.log.fatal(err)
				);
			}

		}, 1000 * 5)
	}
}

const initTournamentMatchesModel = async function (app: FastifyInstance) {
	try {
		const tournamentMatchesModel = new TournamentMatchesModel(app);
		await tournamentMatchesModel.init();

		app.tournamentMatchesModel = tournamentMatchesModel;
	} catch (err) {
		console.log(err);
	}
};

export { TournamentMatchesModel, initTournamentMatchesModel };
