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
		const gameMeta = request.body as {
			player1: { ID: number, score: number },
			player2: { ID: number, score: number },
			gameType: 'XO' | 'PONG',
			gameStartedAt: number,
			gameFinishedAt: number
		};

		await this.matchesService.createGame(gameMeta);

		const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});

		reply.code(status).send(body);
	}
}

export default MatchesController;
