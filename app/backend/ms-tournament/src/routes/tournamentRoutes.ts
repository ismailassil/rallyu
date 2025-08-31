import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import TournamentController from "../controllers/TournamentController";

const tournamentRoutes = function(app: FastifyInstance, options, done: HookHandlerDoneFunction) {
    app.get(
		"/:tournamentId",
		{
			schema: {
				params: {
					type: 'object',
					properties: { tournamentId: { type: "number" } },
      				required: ['tournamentId']
				}
			}
		},
		TournamentController.getTournament
	);

	app.get("/tournaments", TournamentController.getTournaments);

	// Create Tournament
	app.post(
		"/create",
		{
			schema: {
				body: {
					type: "object",
					required: ["title", "access", "game", "date"],
					properties: {
						title: { type: "string", minLength: 2, maxLength: 15 },
						access: { type: "integer", enum: [0, 1] },
						game: { type: "integer", enum: [0, 1] },
						date: { type: "string" },
						host_id: { type: "integer" }
					}
				}
			}
		},
		TournamentController.createTournament
	);

	// Tournament Leave and join
	app.patch("/match/join/:tournamentId", TournamentController.joinMatch);
	app.patch("/match/leave/:tournamentId", TournamentController.leaveMatch);

	// Match logic 
	app.patch("/match/ready", TournamentController.readyMatch);
	app.patch("/match/progress", TournamentController.progressMatch);

    done();
}

export default tournamentRoutes;