import { db } from "../../database";
import MatchesRepository from "../../repositories/[DEPRECATED]/matchesRepository";
// import StatsRepository from "../repositories/statsRepository";
import StatsRepository from "../../repositories/StatsRepository";
import UserRepository from "../../repositories/UserRepository";
import { InternalServerError, UserNotFoundError } from "../../types/auth.types";

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
		gameTypeFilter: 'PING PONG' | 'XO' | 'all'
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
		gameTypeFilter: 'PING PONG' | 'XO' | 'all'
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
		gameTypeFilter: 'PING PONG' | 'XO' | 'all'
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
}

export default StatsService;