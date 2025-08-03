import { FastifyInstance } from "fastify";
import app from "../app";
import sqlite3 from "sqlite3";

interface TournamentMatchesSchema {
	id: number;
	tournament_id: number;
	player_1: number;
	player_2: number;
	player_1_ready: number;
	player_2_ready: number;
	winner: number;
	results: string; // Ex: "5|7"
	stage: string;
	stage_number: number;
}

declare module "fastify" {
	interface FastifyInstance {
		tournamentMatchesModel: TournamentMatchesModel;
	}
}

class TournamentMatchesModel {
	private modelName = "TournamentMatches";
	private sqlQuery = `CREATE TABLE IF NOT EXISTS ${this.modelName} (
            id INTEGER UNIQUE NOT NULL PRIMARY KEY,
            tournament_id INTEGER NOT NULL,
            player_1 INTEGER,
            player_2 INTEGER,
            player_1_ready INTEGER DEFAULT 0 NOT NULL,
            player_2_ready INTEGER DEFAULT 0 NOT NULL,
            winner INTEGER,
            results varchar(255),
            stage varchar(255) NOT NULL,
            stage_number number NOT NULL,
            FOREIGN KEY (tournament_id) REFERENCES Tournaments(id)
        )`;
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

  async promisifiedInsert(tournament_id, stage, stage_num) {
    return new Promise((resolve, reject) => {
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

  async createTournamentMatches(tournament_id: number) {
    try {
        await Promise.all([
            this.promisifiedInsert(tournament_id, "semifinal", 1),
            this.promisifiedInsert(tournament_id, "semifinal", 2),
            this.promisifiedInsert(tournament_id, "final", 1),
        ]);
    } catch(err) {
        console.log(err);
    }
  }

  async matchesGet(tournament_id: number) {
    const data = await new Promise<TournamentMatchesSchema[]>(
      (resolve, reject) => {
        this.DB.all(
          `SELECT * FROM ${this.modelName} WHERE tournament_id=?`,
          [tournament_id],
          (err: Error, rows: TournamentMatchesSchema[]) => {
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

    async playerReadyMatch(id: number, player_place: number) {
        await new Promise((resolve, reject) => {
            this.DB.run(`UPDATE ${this.modelName}
                SET player_${player_place}_ready=1 WHERE id=?`,
                [id],
                (err) => {
                    if (err) reject(err)
                        else resolve(null)
                })
        });
    }

	async monitorReadyMatches() {
		setInterval(async () => {
			try {
				console.log("Interval for ready");
				const data: TournamentMatchesSchema[] = await new Promise<TournamentMatchesSchema []>((resolve, reject) => {
						this.DB.all(`SELECT * FROM ${this.modelName} WHERE player_1_ready=1 AND player_2_ready=1 AND results IS NULL`,
						[],
						(err, rows: TournamentMatchesSchema []) => err ? resolve(rows) : reject(err)
					);
				});
			
				// Notify everysingle user here that their match is ready to play!
				if (data)
					data.forEach(async (match: TournamentMatchesSchema) => {
						// Notify every single user;
					});
			} catch (err) {
				console.log(err);
			}
		}, 1000 * 10);
    }

    // async finishTournament() {
    //     this.DB.run(`UPDATE ${this.modelName} SET results='5|7' WHERE stage='final'`);
    // }
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

export { TournamentMatchesSchema, initTournamentMatchesModel };
