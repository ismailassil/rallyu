import MatchesRepository from "../../repositories/MatchesRepository";
import StatsService from "./StatsService";

class MatchesService {

	constructor(
		private statsService: StatsService,
		private matchesRepository: MatchesRepository
	) {}

	async createGame(gameMeta : {
		player1: { ID: number, score: number },
		player2: { ID: number, score: number },
		gameType: 'XO' | 'PONG',
		gameStartedAt: number,
		gameFinishedAt: number
	}) {

		const updatedPlayersStats = await this.statsService.applyFinishedGame(
			gameMeta.player1.ID,
			gameMeta.player1.score,
			gameMeta.player2.ID,
			gameMeta.player2.score,
		);
		if (!updatedPlayersStats)
			return ;

		const { UPDATE_P1, UPDATE_P2 } = updatedPlayersStats;
		const { XPGain: player1XPGain } = UPDATE_P1;
		const { XPGain: player2XPGain } = UPDATE_P2;

		const createdMatchID = await this.matchesRepository.create(
			gameMeta.player1.ID,
			gameMeta.player1.score,
			player1XPGain,
			gameMeta.player2.ID,
			gameMeta.player2.score,
			player2XPGain,
			gameMeta.gameType,
			gameMeta.gameStartedAt,
			gameMeta.gameFinishedAt
		);

		return createdMatchID;
	}

	async getUserMatches(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		return await this.matchesRepository.findAll(userID, { timeFilter, gameTypeFilter, paginationFilter });
	}
}

export default MatchesService;
