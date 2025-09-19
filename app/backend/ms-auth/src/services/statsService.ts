import { db } from "../database";
import MatchesRepository from "../repositories/matchesRepository";
import UserRepository from "../repositories/userRepository";
import { InternalServerError, UserNotFoundError } from "../types/auth.types";

interface IUserPerformance {
	level: number,
	xp: number,
	rank: number,
	win_rate: number,
	current_streak: string,
	longest_streak: number,
	games : {
		games: number,
		wins: number,
		losses: number,
		draws: number,
		ping_pong: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		},
		tic_tac_toe: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		}
	}
};

interface IGame {
	game_type: string,
	total_matches: number,
	wins: number,
	losses: number,
	draws: number,
	average_score: number
}

interface IGameHistory {
	game_id: number,
	game_type: string,
	player_home: {
		username: string,
		avatar: string,
		score: string
	},
	player_away: {
		username: string,
		avatar: string,
		score: string
	}
}

interface IUserInfo {
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	bio: string,
	avatar_url: string,
	role: string
}

interface IUserProfile {
	profile: IUserInfo,
	performance: IUserPerformance,
	games_history: Array<IGameHistory>
}

class StatsService {
	private userRepository: UserRepository;
	private matchesRepository: MatchesRepository;

	constructor() {
		this.userRepository = new UserRepository();
		this.matchesRepository = new MatchesRepository();
	}

	async getUserPerformance(userID: number) : Promise<any | null> {
		const existingUser = await this.userRepository.findById(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		// performance = level, xp... total matches (w/l/d)
		const performance = await this.matchesRepository.getUserPerformance(existingUser.id);

		return performance;
	}

	async getUserFullStats(userID: number) {
		const existingUser = await this.userRepository.findById(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const fullStats = await this.matchesRepository.getUserFullStats(existingUser.id);

		return fullStats;
	}
}

export default StatsService;