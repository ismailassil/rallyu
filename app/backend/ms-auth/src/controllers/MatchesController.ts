import { FastifyReply, FastifyRequest } from "fastify";
import MatchesRepository from "../repositories/MatchesRepository";
import AuthResponseFactory from "./AuthResponseFactory";
import MatchesService from "../services/GameAndStats/MatchesService";

class MatchesController {
	private matchesRepository: MatchesRepository;
	private matchesService: MatchesService;

	constructor() {
		this.matchesRepository = new MatchesRepository();
		this.matchesService = new MatchesService(this.matchesRepository);
	}

	async newMatch(request: FastifyRequest, reply: FastifyReply) {
		// we need to add some basic auth
		try {
			// const user_id = request.user?.sub;
			const payload = request.body as any;



			await this.matchesRepository.create(
				payload.player_home_score,
				payload.player_away_score,
				payload.game_type,
				payload.player_home_id,
				payload.player_away_id,
				payload.started_at,
				payload.finished_at
			);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { id: matchID });

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async getMatch(request: FastifyRequest, reply: FastifyReply) {
		// we need to add some basic auth
		try {
			// const user_id = request.user?.sub;
			const { id } = request.params as any;

			const match = await this.matchesRepository.findById(id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { match });

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default MatchesController;
