import { FastifyReply, FastifyRequest } from "fastify";
import { TournamentMatchesSchema, TournamentSchema } from "../types/tournament";

class TournamentController {

	// Get a single tournament based on Id
    static async getTournament (req: FastifyRequest<{ Params: { tournamentId: number } }>, rep: FastifyReply) {
		try {
			const { tournamentId }: { tournamentId: number } = req.params;

			const tournament = await req.server.tournamentModel.tournamentGet(
				Number(tournamentId)
			);

			if (!tournament) return rep.code(200).send({
				status: true,
				data: {}
			});

			const tournamentMatches =
				await req.server.tournamentMatchesModel.matchesGet(tournamentId);
			
			for (const match of tournamentMatches) {
				if (match.player_1)
					match.player_1_username = req.server.jsonCodec.decode(
						(await req.server.nc.request("user.username", req.server.jsonCodec.encode({ user_id: match.player_1 }))).data
					).username;
				if (match.player_2)
					match.player_2_username = req.server.jsonCodec.decode(
						(await req.server.nc.request("user.username", req.server.jsonCodec.encode({ user_id: match.player_2 }))).data
					).username
				if (match.stage === "final" && match.winner) {
					if (match.winner === match.player_1)
						match.winner_username = match.player_1_username
					if (match.winner === match.player_2)
						match.winner_username = match.player_2_username
				}
			}

			tournament.host_username = req.server.jsonCodec.decode(
				(await req.server.nc.request("user.username", req.server.jsonCodec.encode({ user_id: tournament.host_id }))).data
			).username

			return rep.code(200).send({
				status: true,
				data: {
					tournament,
					matches: tournamentMatches,
				},
			});

		} catch (err: unknown) {
			return rep.code(501).send({
				status: false,
				message: "Something went wrong",
			});
		}
	}

	// get All Tournaments
	static async getTournaments(req: FastifyRequest, rep: FastifyReply) {
		try {
			let userId: number | undefined = Number(req.headers["x-user-id"]);
			
			const tournaments: TournamentSchema[] =
				await req.server.tournamentModel.tournamentGetAll(req.query.mode, req.query.search);
			
			if (userId) {
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
			
			return rep.code(200).send({
				status: true,
				data: tournaments,
			});
		} catch (err: unknown) {
			// req.server.log.error(err);
			return rep.code(500).send({
				status: false,
				message: "Something went wrong"
			});
		}
	}

	// CREATE TOURNAMENT
	static async createTournament(
		req: FastifyRequest<{
			Body: {
				title: string;
				access: number;
				game: number;
				date: string;
				hostIn: boolean;
				host_id?: number;
			};
		}>,
		rep: FastifyReply
	) {
		try {
			const { title, game, access, date, hostIn, host_id } = req.body;
			const now = Date.now();
			const dateTime = new Date(date).getTime();

			// if ((dateTime - now) / (1000 * 60) < 30) {
			// 	return rep.code(400).send({ status: false, message: "Tournament must be scheduled at least 30 min ahead." });
			// }

			const newTournament = await req.server.tournamentModel.tournamentAdd({
				title,
				game,
				access,
				date,
				host_id,
				hostIn
			});

			console.log("=====================================")
			console.log("=====================================")
			console.log(req.body)
			console.log("=====================================")
			console.log("=====================================")

			await req.server.tournamentMatchesModel.createTournamentMatches(newTournament.id, hostIn, host_id as number);

			return rep.code(201).send({
				status: true,
				message: "Tournament created successfully",
				data: newTournament
			});
		} catch (err) {
			req.server.log.error(err);
			return rep.code(500).send({ status: false, message: "Internal server error" });
		}
	}

	// PLAYER JOIN TOURNAMENT
	static async joinMatch(
		req: FastifyRequest<{ Params: { tournamentId: number }; Body: { id: number } }>,
		rep: FastifyReply
	) {
		try {
			const { tournamentId } = req.params;
			const { id: playerId } = req.body;

			const tournamentMatches: TournamentMatchesSchema[] = 
				await req.server.tournamentMatchesModel.matchesGet(tournamentId);

			for (let i = 0; i < tournamentMatches.length - 1; i++) {
				if (!tournamentMatches[i].player_1 || !tournamentMatches[i].player_2) {
					const playerSlot: number = !tournamentMatches[i].player_1 ? 1 : 2;
					await req.server.tournamentMatchesModel.playerJoinMatch(
						tournamentMatches[i].id,
						playerId,
						playerSlot
					);
					await req.server.tournamentModel.tournamentUpdateSize(
						"add",
						tournamentId
					);
					break;
				}
			}

			return rep.code(201).send({ status: true, message: "Player joined the tournament." });
		} catch (err) {
			return rep.code(500).send({ status: false, message: "Something went wrong." });
		}
	}

	// PLAYER LEAVE TOURNAMENT
	static async leaveMatch(
		req: FastifyRequest<{ Params: { tournamentId: number }; Body: { id: number } }>,
		rep: FastifyReply
	) {
		try {
			const { tournamentId } = req.params;
			const { id: playerId } = req.body;

			const tournamentMatches: TournamentMatchesSchema[] =
				await req.server.tournamentMatchesModel.matchesGet(tournamentId);

			for (let i = 0; i < tournamentMatches.length - 1; i++) {
				const playerSlot: number | null = tournamentMatches[i].player_1 === playerId ? 1 :
					tournamentMatches[i].player_2 === playerId ? 2 : null;

				if (playerSlot) {
					await req.server.tournamentMatchesModel.playerLeaveMatch(
						tournamentMatches[i].id,
						playerSlot,
					);
					await req.server.tournamentModel.tournamentUpdateSize(
						"remove",
						tournamentId
					);
					break;
				}
			}

			return rep.code(201).send({ status: true, message: "Player left the tournament." });
		} catch (err) {
			return rep.code(500).send({ status: false, message: "Something went wrong." });
		}
	}

	// PLAYER READY FOR THE MATCH
	static async readyMatch(
		req: FastifyRequest<{ Body: { matchId: number } }>,
		rep: FastifyReply
	) {
		try {
			const { matchId } = req.body;
			const playerId = Number(req.headers["x-user-id"]);

			if (!playerId || !matchId)
				return rep.code(400).send({ status: false, message: "Bad request!" });

			await req.server.tournamentMatchesModel.playerReadyMatch(matchId, playerId);

			return rep.code(201).send({ status: true, message: "Ready for match!" });
		} catch (err) {
			req.server.log.fatal(err);
			return rep.code(500).send({ status: false, message: "Something went wrong" });
		}
	}

	// Procced with the tournament process
	static async progressMatch(
		req: FastifyRequest<{ Body: { match_id: number; winner: number; results: any } }>,
		rep: FastifyReply
	) {
		// *? Need
		// *? match_id - winner - results;
		try {
			await req.server.tournamentMatchesModel.progressMatchTournament(req.body);

			return rep.code(201).send({ status: true, message: "Tournament updated!" });
		} catch (err) {
			return rep.code(500).send({ status: false, message: "Something went wrong." });
		}
	}
};

export default TournamentController;