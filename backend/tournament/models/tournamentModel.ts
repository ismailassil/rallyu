import { FastifyInstance } from "fastify";
import app from "../app";
import sqlite3 from "sqlite3";

interface TournamentSchema {
  id: number;
  title: string;
  host_id: number;
  mode: string;
  contenders_size: number;
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
  private sqlQuery = `CREATE TABLE IF NOT EXISTS ${this.modelName} (
            id INTEGER UNIQUE NOT NULL PRIMARY KEY,
            title varchar(255) NOT NULL,
            host_id INTEGER NOT NULL,
            mode varchar(255) NOT NULL,
            contenders_size int DEFAULT 4 NOT NULL,
            access varchar(255) NOT NULL,
            start_date timestamp NOT NULL
        )`;
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
        else resolve(0);
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

  async tournamentAdd({ title, game, access, date }) {
    const statement: sqlite3.Statement = await this.prepareStatement();

    const id: number = await new Promise((resolve, reject) => {
      statement.run(
        title,
        1,
        !game ? "ping-pong" : "tic-tac-toe",
        4,
        !access ? "public" : "private",
        date,
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
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
      host_id: 1,
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
          `SELECT * FROM ${this.modelName} LIMIT ?`,
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
