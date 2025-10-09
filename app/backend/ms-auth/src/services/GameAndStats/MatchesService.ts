import MatchesRepository from "../../repositories/[DEPRECATED]/matchesRepository";

class MatchesService {
	constructor(
		private matchesRepository: MatchesRepository
	) {}

	async createMatch(
		player_home_score: number,
		player_away_score: number,
		game_type: string,
		player_home_id: number,
		player_away_id: number,
		started?: string,
		finished?: string
	) {
		const createdMatchID = await this.matchesRepository.create(
			player_home_score, 
			player_away_score, 
			game_type, 
			player_home_id, 
			player_away_id, 
			started,
			finished
		);

		return createdMatchID;
	}

	async getUserMatches(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		return await this.matchesRepository.getMatchesByUser(userID, timeFilter, gameTypeFilter, paginationFilter);
	}
}

export default MatchesService;