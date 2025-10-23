import StatsRepository from "../../repositories/StatsRepository";
import UserRepository from "../../repositories/UserRepository";
import { UserNotFoundError } from "../../types/exceptions/user.exceptions";

class StatsService {
	private readonly XP_SCALE = 100;
	private readonly LEVEL_GROWTH_RATE = 2;

	constructor(
		private userRepository: UserRepository,
		private statsRepository: StatsRepository
	) {}

	// async createUserRecords(userID: number) {
	// 	const existingUser = await this.userRepository.findOne(userID);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	await this.statsRepository.create(userID);
	// }

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

		const analytics = await this.statsRepository.getUserDetailedAnalyticsGroupedByDay(
			userID,
			gameTypeFilter,
			daysCount
		);

		return analytics;
	}

	async getRankByXP(paginationFilter?: { page: number, limit: number }) {
		const rankByXP = await this.statsRepository.getRankByXP(paginationFilter);

		return rankByXP;
	}

	async applyFinishedGame(ID_P1: number, SCORE_P1: number, ID_P2: number, SCORE_P2: number) {
		const STATS_P1 = await this.statsRepository.findByUserID(ID_P1);
		const STATS_P2 = await this.statsRepository.findByUserID(ID_P2);
		if (!STATS_P1 || !STATS_P2)
			return ;

		const XP_P1 = STATS_P1.total_xp;
		const XP_P2 = STATS_P2.total_xp;

		const LVL_P1 = this.levelFromXP(XP_P1);
		const LVL_P2 = this.levelFromXP(XP_P2);

		const XP_GAIN_P1 = this.calculateXPGain(
			LVL_P1,
			LVL_P2,
			SCORE_P1,
			SCORE_P2
		);

		const XP_GAIN_P2 = this.calculateXPGain(
			LVL_P2,
			LVL_P1,
			SCORE_P2,
			SCORE_P1
		);

		const UPDATE_P1 = this.calculateXPLevelUpdate(
			XP_P1,
			XP_GAIN_P1
		);
		const UPDATE_CURRENT_STREAK_P1 = (SCORE_P1 > SCORE_P2) ? STATS_P1.current_streak + 1 : (SCORE_P1 < SCORE_P2) ? 0 : STATS_P1.current_streak;

		const UPDATE_P2 = this.calculateXPLevelUpdate(
			XP_P2,
			XP_GAIN_P2
		);
		const UPDATE_CURRENT_STREAK_P2 = (SCORE_P2 > SCORE_P1) ? STATS_P2.current_streak + 1 : (SCORE_P2 < SCORE_P1) ? 0 : STATS_P2.current_streak;

		await this.statsRepository.update(STATS_P1.id, {
			level: UPDATE_P1.newLevel,
			total_xp: UPDATE_P1.newXP,
			current_streak: UPDATE_CURRENT_STREAK_P1,
			longest_streak: Math.max(STATS_P1.longest_streak, UPDATE_CURRENT_STREAK_P1)
		});

		await this.statsRepository.update(STATS_P2.id, {
			level: UPDATE_P2.newLevel,
			total_xp: UPDATE_P2.newXP,
			current_streak: UPDATE_CURRENT_STREAK_P2,
			longest_streak: Math.max(STATS_P2.longest_streak, UPDATE_CURRENT_STREAK_P2)
		});

		return { UPDATE_P1, UPDATE_P2 };
	}

	private calculateXPGain(playerLevel: number, oppLevel: number, playerScore: number, oppScore: number) {
		// BASE XP (BASED ON GAME TYPE/MODE)
		const BASE_XP = 50;
		const RESULT_FACTOR = playerScore > oppScore ? 1.5 : playerScore < oppScore ? 0.5 : 1.0;
		const DIFFICULTY_FACTOR = Math.max(Math.min(1 + (oppLevel - playerLevel) * 0.05, 2), 0.5);
		const SCORE_FACTOR = Math.max(Math.min(1 + Math.abs(playerScore - oppScore) * 0.05, 2), 0.5);
		const XP_GAIN = BASE_XP * RESULT_FACTOR * DIFFICULTY_FACTOR * SCORE_FACTOR;

		return Math.round(XP_GAIN);
	}

	private XPFromLevel(level: number) {
		if (level <= 0)
			return 0;

		const XP_FOR_LEVEL = this.XP_SCALE * (Math.pow(this.LEVEL_GROWTH_RATE, level) - 1);

		return XP_FOR_LEVEL;
	}

	private levelFromXP(xp: number) {
		if (xp <= 0)
			return 0;

		const LEVEL_FOR_XP = Math.log((xp / this.XP_SCALE) + 1) / Math.log(this.LEVEL_GROWTH_RATE);

		return LEVEL_FOR_XP;
	}

	private calculateXPLevelUpdate(currentXP: number, XPGain: number) {
		const newXP = currentXP + XPGain;
		const currentLevel = this.levelFromXP(currentXP);
		const newLevel = this.levelFromXP(newXP);
		const levelGain = newLevel - currentLevel;

		return {
			currentXP,
			newXP,
			XPGain,
			currentLevel,
			newLevel,
			levelGain
		};
	}
}

export default StatsService;
