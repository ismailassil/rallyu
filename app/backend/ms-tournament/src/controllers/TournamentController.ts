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
				game: number;
				date: string;
				hostIn: boolean;
				host_id?: number;
			};
		}>,
		rep: FastifyReply
	) {
		try {
			const { title, game, date, hostIn, host_id } = req.body;

			const trimmedTitle = title?.trim();
			if (!trimmedTitle || trimmedTitle.length < 2 || trimmedTitle.length > 15) {
				return rep.code(400).send({ 
					status: false, 
					message: "Tournament title length must be between 2 - 15 characters",
					code: 5
				});
			}

			if (game !== 1 && game !== 0) {
				return rep.code(400).send({ 
					status: false, 
					message: "Choose between the available game modes below",
					code: 4
				});
			}

			const now = Date.now();
			const dateTime = new Date(date).getTime();

			const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
			if (!dateRegex.test(date)) {
				return rep.code(400).send({ 
					status: false, 
					message: "Invalid date format. Expected format: YYYY-MM-DDTHH:mm (e.g., 2025-10-28T21:18)", 
					code: 2
				});
			}

			// Comment this if u want to test the creation of a tournament at any give time
			if ((dateTime - now) / (1000 * 60) < 3) {
				return rep.code(400).send({ status: false, message: "Tournament must be scheduled at least 3 min ahead.", code: 3 });
			}

			if (isNaN(dateTime)) {
				return rep.code(400).send({ 
					status: false, 
					message: "Invalid date value",
					code: 1
				});
			}

			const newTournament = await req.server.tournamentModel.tournamentAdd({
				title,
				game,
				date,
				host_id,
				hostIn
			});

			req.server.tournamentMatchesModel.createTournamentMatches(newTournament.id, hostIn, host_id as number);

			return rep.code(201).send({
				status: true,
				message: "Tournament created successfully",
				data: newTournament
			});
		} catch (err) {
			req.server.log.error(err);
			return rep.code(500).send({ status: false, message: "Something went wrong" });
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

			const tournamentMatches: any = 
				await req.server.tournamentMatchesModel.matchesGet(tournamentId);

							console.log(tournamentMatches)

			
			if (tournamentMatches[0].state !== "pending")
				return (rep.code(401).send({ status: true, message: "Unfortunetly you cannot access nor leave the tournament now." }))

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
			req.server.log.fatal(err)
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

			const tournamentMatches: any =
				await req.server.tournamentMatchesModel.matchesGet(tournamentId);

			console.log(tournamentMatches)

			if (tournamentMatches[0].state !== "pending")
				return (rep.code(401).send({ status: true, message: "Unfortnetly you cannot access nor leave the tournament now." }))

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

			const data = await req.server.tournamentMatchesModel.checkForAvailability(matchId, playerId);
			console.log(data);
			if (data)
				return rep.code(400).send({ status: false, message: "You are already playing in a match tournament; Finish it then come back!" })

			await req.server.tournamentMatchesModel.playerReadyMatch(matchId, playerId);

			return rep.code(201).send({ status: true, message: "Ready for match!" });
		} catch (err) {
			req.server.log.fatal(err);
			return rep.code(500).send({ status: false, message: "Something went wrong" });
		}
	}

	// Procced with the tournament process
	static async progressMatch(
		req: FastifyRequest,
		rep: FastifyReply
	) {
		try {
			const data = req.body;
			const authHeader = req.headers["authorization"]
			const progress = {
				winner: data.player1.score > data.player2.score ? data.player1.ID : data.player2.ID,
				results: `${data.player1.score}|${data.player2.score}`,
				id: data.gameId
			}
			// Handle auth token Bearer
			if (!authHeader || !authHeader.startsWith("Bearer "))	
				return (rep.code(401).send({ status: false, message: "Unauthorized request" }))
			
			const token = authHeader.substring(7);
			const expected_token = process.env.MS_TOURN_API_KEY;
			
			if (!expected_token || token.length !== expected_token.length)
				return (rep.code(401).send({ status: false, message: "Unauthorized request" }));
			
			let isValid = true;
			for (let i = 0; i < expected_token.length; i++) {
				if (token[i] !== expected_token[i])
					isValid = false;
			}
			
			if (!isValid)
				return (rep.code(401).send({ status: false, message: "Unauthorized request" }));

			await req.server.tournamentMatchesModel.progressMatchTournament(progress);

			return rep.code(201).send({ status: true, message: "Tournament updated!" });
		} catch (err) {
			return rep.code(500).send({ status: false, message: "Something went wrong." });
		}
	}

	static async getMatchId(
		req: FastifyRequest,
		rep: FastifyReply
	) {
		try {
			const data = await req.server.tournamentMatchesModel.getMatchRoomId(req.query.match_id);

			return rep.code(200).send({ status: true, data });
		} catch (err) {
			return rep.code(500).send({ status: false, message: "Something went wrong." });
		}
	}
};

export default TournamentController;