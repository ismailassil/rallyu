import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import serverConfig from "./config/serverConfig";
import connectDatabase from "./database/database";
import fastifyCors from "@fastify/cors";
import {
  initTournamentModel,
  TournamentSchema,
} from "./models/tournamentModel";
import {
  initTournamentMatchesModel,
  TournamentMatchesSchema,
} from "./models/tournamentMatchesModel";

const app = fastify(serverConfig);

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
app.register(connectDatabase);

app.after(async () => {
  await initTournamentMatchesModel(app);
  await initTournamentModel(app);
  app.tournamentModel.startTournaments();
  app.tournamentMatchesModel.monitorReadyMatches();
});

app.get(
  "/api/v1/tournament/:tournamentId",
  async function (req: FastifyRequest, rep: FastifyReply) {
    try {
      const tournamentId = req.params.tournamentId;

      const tournament = await req.server.tournamentModel.tournamentGet(
        tournamentId
      );
      const tournamentMatches =
        await req.server.tournamentMatchesModel.matchesGet(tournamentId);

      if (!tournament) return rep.code(404).send({});
      console.log(tournament);
      console.log(tournamentMatches);

      return rep.code(200).send({
        status: true,
        data: {
          tournament,
          matches: tournamentMatches,
        },
      });
    } catch (err) {
      return rep.code(404).send({
        status: false,
        message: "Tournament was not found!",
      });
    }
  }
);

app.get(
  "/api/v1/tournaments",
  async function (req: FastifyRequest, res: FastifyReply) {
    const query = req.query;
    let userId: number | undefined;

    const tournaments: unknown[] =
      await req.server.tournamentModel.tournamentGetAll(7);

    if (query?.userId) {
      userId = Number(query.userId);

      for (const tournament of tournaments) {
        const matches: TournamentMatchesSchema[] =
          await req.server.tournamentMatchesModel.matchesGet(tournament.id);
        if (
          matches.find((el) => el.player_1 === userId || el.player_2 === userId)
        )
          tournament["isUserIn"] = true;
      }
    }

    console.log(tournaments);

    return res.code(200).send({
      status: true,
      data: tournaments,
    });
  }
);

const tournamentSchema = {
  body: {
    type: "object",
    required: ["title", "access", "game", "date"],
    properties: {
      title: { type: "string", minLength: 2, maxLength: 15 },
      access: { type: "integer", enum: [0, 1] },
      game: { type: "integer", enum: [0, 1] },
      date: { type: "string" },
    },
  },
};

app.post(
  "/api/v1/tournament/create",
  { schema: tournamentSchema },
  async function (req: FastifyRequest, rep: FastifyReply) {
    try {
      const { title, game, access, date } = req.body;

      const now = new Date().getTime();
      const dateTime = new Date(date).getTime();

      if ((dateTime - now) / (1000 * 60) < 30) {
        return rep.code(400).send({
          status: false,
          message: "Tournament must be scheduled at least 30 min ahead.",
        });
      }

      // Database logic
      const newTournament = await req.server.tournamentModel.tournamentAdd({
        title,
        game,
        access,
        date,
      });
      req.server.tournamentMatchesModel.createTournamentMatches(
        newTournament.id
      );

      return rep.code(201).send({
        status: true,
        message: "Tournament created successfully",
        data: newTournament,
      });
    } catch (err) {
      app.log.error(err);

      return rep.code(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }
);

app.patch(
  "/api/v1/tournament-matches/join/:tournamentId",
  async function (req: FastifyRequest, rep: FastifyReply) {
    try {
      const tournamentId = req.params.tournamentId;
      const playerId = req.body.id;
      const tournamentMatches =
        await req.server.tournamentMatchesModel.matchesGet(tournamentId);

      for (let i = 0; i < tournamentMatches.length - 1; i++) {
        if (!tournamentMatches[i].player_1 || !tournamentMatches[i].player_2) {
          const player: number = !tournamentMatches[i].player_1 ? 1 : 2;

          await req.server.tournamentMatchesModel.playerJoinMatch(
            tournamentMatches[i].id,
            playerId,
            player
          );
          await req.server.tournamentModel.tournamentUpdateSize(
            "add",
            tournamentMatches[i].id
          );
          break;
        }
      }

      return rep.code(201).send({
        status: true,
        message: "Player joined the tournament.",
      });
    } catch (err) {
      console.log(err);
      return rep.code(500).send({
        status: false,
        message: "Something went wrong.",
      });
    }
  }
);

app.patch(
  "/api/v1/tournament-matches/leave/:tournamentId",
  async function (req: FastifyRequest, rep: FastifyReply) {
    try {
      const tournamentId = req.params.tournamentId;
      const playerId = req.body.id;
      const tournamentMatches =
        await req.server.tournamentMatchesModel.matchesGet(tournamentId);

      // Refactor this please
      for (let i = 0; i < tournamentMatches.length - 1; i++) {
        if (tournamentMatches[i].player_1 === playerId) {
          await req.server.tournamentMatchesModel.playerLeaveMatch(
            tournamentMatches[i].id,
            1
          );
          await req.server.tournamentModel.tournamentUpdateSize(
            "remove",
            tournamentMatches[i].id
          );
          break;
        }
        if (tournamentMatches[i].player_2 === playerId) {
          await req.server.tournamentMatchesModel.playerLeaveMatch(
            tournamentMatches[i].id,
            2
          );
          await req.server.tournamentModel.tournamentUpdateSize(
            "remove",
            tournamentMatches[i].id
          );
          break;
        }
      }

      return rep.code(201).send({
        status: true,
        message: "Player left the tournament.",
      });
    } catch (err) {
      return rep.code(500).send({
        status: false,
        message: "Something went wrong.",
      });
    }
  }
);

app.patch(
	"/api/v1/tournament-matches/ready/:tournamentId",
	async function (req: FastifyRequest, rep: FastifyReply) {
	try {
		const playerId = req.body.id;
		const tournamentId = req.params.tournamentId;

		const tournamentMatches: TournamentMatchesSchema[] =
		await req.server.tournamentMatchesModel.matchesGet(tournamentId);

		if (!playerId || !tournamentId) throw Error("Bad request!");

		for (let i = 0; i < tournamentMatches.length; i++) {
			if (tournamentMatches[i].player_1 === playerId) {
				await req.server.tournamentMatchesModel.playerReadyMatch(
					tournamentMatches[i].id,
					1
				);
				break;
			}
			if (tournamentMatches[i].player_2 === playerId) {
				await req.server.tournamentMatchesModel.playerReadyMatch(
					tournamentMatches[i].id,
					2
				);
				break;
			}
      }

      return rep.code(201).send({
        status: true,
        message: "Ready for match!",
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        return rep.code(400).send({
          status: false,
          message: err.message,
        });
    }
  }
);

app.patch("/api/v1/tournament-matches/progress", async function (req: FastifyRequest, rep: FastifyReply) {
	// *? Need
	// *? match_id - stage - stage_number - winner - results;

	const data = {};
	await req.server.tournamentMatchesModel.progressMatchTournament(data);

});

export default app;
