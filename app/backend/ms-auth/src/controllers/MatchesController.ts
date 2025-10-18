import { FastifyReply, FastifyRequest } from "fastify";
import AuthResponseFactory from "./AuthResponseFactory";
import MatchesService from "../services/GameAndStats/MatchesService";
import { UnauthorizedError } from "../types/exceptions/AAuthError";
import { env } from "../config/env";

class MatchesController {
	constructor(
		private matchesService: MatchesService
	) {}

	async createGameHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			// BASIC AUTH
			const authHeader = request.headers.authorization;
			if (!authHeader)
				throw new UnauthorizedError('Unauthorized... You need api key for this.');

			const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
			if (!apiKey || apiKey !== env.API_KEY)
				throw new UnauthorizedError('Unauthorized... Your api key isnt valid.');

			const {
				player_home_score,
				player_away_score,
				game_type,
				player_home_id,
				player_away_id,
				started_at,
				finished_at
			} = request.body as any;

			await this.matchesService.createGame(
				player_home_id,
				player_home_score,
				player_away_id,
				player_away_score,
				game_type,
				started_at,
				finished_at
			);

			const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	// async fetchGameHandler(request: FastifyRequest, reply: FastifyReply) {
	// 	// we need to add some basic auth
	// 	try {
	// 		// const user_id = request.user?.sub;
	// 		const { id } = request.params as any;

	// 		const match = await this.matchesRepository.findById(id);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { match });

	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }
}

export default MatchesController;
