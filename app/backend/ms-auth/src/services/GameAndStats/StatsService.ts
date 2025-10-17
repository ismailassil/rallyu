import { db } from "../../database";
import MatchesRepository from "../../repositories/[DEPRECATED]/matchesRepository";
// import StatsRepository from "../repositories/statsRepository";
import StatsRepository from "../../repositories/StatsRepository";
import UserRepository from "../../repositories/UserRepository";
import { UserNotFoundError } from "../../types/exceptions/user.exceptions";

class StatsService {


	constructor(
		private userRepository: UserRepository,
		private statsRepository: StatsRepository
	) {}

	async createUserRecords(userID: number) {
		const existingUser = await this.userRepository.findOne(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		await this.statsRepository.create(userID);
	}

	async getUserRecords(userID: number) : Promise<any | null> {
		const existingUser = await this.userRepository.findOne(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const records = await this.statsRepository.getUserRecords(userID);

		return records;
	}

	async getUserStats(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all'
	) {
		const existingUser = await this.userRepository.findOne(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const stats = await this.statsRepository.getUserStats(userID, timeFilter, gameTypeFilter);

		return stats;
	}

	async getUserAnalytics(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all'
	) {
		const existingUser = await this.userRepository.findOne(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const analytics = await this.statsRepository.getUserDetailedAnalytics(userID, timeFilter, gameTypeFilter);

		return analytics;
	}
	async getUserAnalyticsByDay(
		userID: number,
		daysCount: number = 7,
		gameTypeFilter: 'PONG' | 'XO' | 'all'
	) {
		const existingUser = await this.userRepository.findOne(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const analytics = await this.statsRepository.getUserDetailedAnalyticsGroupedByDay(userID, gameTypeFilter, daysCount);

		return analytics;
	}

	async getRankByXP(paginationFilter?: { page: number, limit: number }) {
		const rankByXP = await this.statsRepository.getRankByXP(paginationFilter);

		return rankByXP;
	}

	private calculateXPGain(playerLevel: number, oppLevel: number, playerScore: number, oppScore: number) {
		// BASE XP (BASED ON GAME TYPE/MODE)
		const BASE_XP = 50;
		const RESULT_FACTOR = playerScore > oppScore ? 1.5 : playerScore < oppScore ? 0.5 : 1.0;
		const DIFFICULTY_FACTOR = Math.max(Math.min(1 + (oppLevel - playerLevel) * 0.05, 2), 0.5);
		const SCORE_FACTOR = Math.max(Math.min(1 + Math.abs(playerScore - oppScore) * 0.05, 2), 0.5);
		const XP_GAIN = BASE_XP * RESULT_FACTOR * DIFFICULTY_FACTOR * SCORE_FACTOR;

		return XP_GAIN;
	}
}

export default StatsService;
