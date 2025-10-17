import MatchesRepository from "../../repositories/MatchesRepository";
import StatsService from "./StatsService";

class MatchesService {

	constructor(
		private statsService: StatsService,
		private matchesRepository: MatchesRepository
	) {}

	async createGame(
		player_home_id: number,
		player_home_score: number,
		player_away_id: number,
		player_away_score: number,
		game_type: string,
		started_at: number,
		finished_at: number
	) {

		const updatedPlayersStats = await this.statsService.applyFinishedGame(
			player_home_id,
			player_home_score,
			player_away_id,
			player_away_score
		);
		if (!updatedPlayersStats)
			return ;

		const { UPDATE_P1, UPDATE_P2 } = updatedPlayersStats;
		const { XPGain: player_home_xp_gain } = UPDATE_P1;
		const { XPGain: player_away_xp_gain } = UPDATE_P2;

		const createdMatchID = await this.matchesRepository.create(
			player_home_id,
			player_home_score,
			player_home_xp_gain,
			player_away_id,
			player_away_score,
			player_away_xp_gain,
			game_type,
			started_at,
			finished_at
		);

		return createdMatchID;
	}

	async getUserMatches(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		// return await this.matchesRepository.getMatchesByUser(userID, timeFilter, gameTypeFilter, paginationFilter);
		return await this.matchesRepository.findAll(userID, { timeFilter, gameTypeFilter, paginationFilter });
	}
}

export default MatchesService;
