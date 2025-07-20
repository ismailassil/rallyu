import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import path from "path";
import sqlite3 from "sqlite3";
import fp from "fastify-plugin";

declare module 'fastify' {
    interface FastifyInstance {
        DB: sqlite3.Database
    }
}

const sqlite: sqlite3.sqlite3 = sqlite3.verbose();
const DBPath: string = path.join(import.meta.dirname, "../../tournament.db");

const connectDatabase = function (app: FastifyInstance, options, done) {
  console.log("Server Firing up...");
  console.log("Databse setup");

  const DB: sqlite3.Database = new sqlite.Database(DBPath, (err) => {
    if (err) {
      app.log.error("Database connection failed:", err);
      throw err;
    }
    app.log.info("Database connected!");
  });

  app.decorate("DB", DB);
  app.decorate("tournamentModel", undefined);

  app.addHook("onClose", (instance, done) => {
    DB.close((err) => {
      if (err) app.log.error("Database closing failed!");
      else app.log.info("Database closed successfully");
    });

    done();
  });
  done();
};

export default fp(connectDatabase, { name: "fastify-sqlite" });
