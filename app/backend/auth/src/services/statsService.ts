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

	// async getUserProfile(username: string) : Promise<IUserProfile> {
	// 	const existingUser = await this.userRepository.findByUsername(username);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	const userInfo: IUserInfo = {
	// 		first_name: existingUser.first_name,
	// 		last_name: existingUser.last_name,
	// 		email: existingUser.email,
	// 		username: existingUser.username,
	// 		bio: existingUser.bio,
	// 		avatar_url: existingUser.avatar_url,
	// 		role: existingUser.role
	// 	}
	// 	const userPerformance: IUserPerformance = await this.getUserPerformance(username);
	// 	const userGamesHistory: Array<IGameHistory> = await this.getUserMatches(username, 1);

	// 	const userProfile: IUserProfile = {
	// 		profile: userInfo,
	// 		performance: userPerformance,
	// 		games_history: userGamesHistory
	// 	}

	// 	return userProfile;
	// }

	async getUserStatsSummary(user_id: number) : Promise<any | null> {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const summary = await this.matchesRepository.getUserSummaryStats(existingUser.id);

		return summary;
	}

	async getUserRecentMatches(user_id: number) : Promise<any | null> {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const recentMatches = await this.matchesRepository.getUserRecentMatches(user_id);

		return recentMatches;
	}

	async getUserStats(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const userStats = await this.matchesRepository.getUserStats(user_id);

		return userStats;
	}

	async getUserMatches(user_id: number, page: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const userMatches = await this.matchesRepository.getUserMatches(user_id, 'all', 'all', page);

		return userMatches;
	}

	// async getUserPerformance(username: string) : Promise<IUserPerformance> {
	// 	const existingUser = await this.userRepository.findByUsername(username);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	const matchesStats = await this.matchesRepository.getMatchesStatsByUserPerGameType(existingUser.id);
	// 	if (!matchesStats)
	// 		throw new InternalServerError();
		
	// 	const userStats = await db.get(`SELECT * FROM users_stats WHERE user_id = ?`, [existingUser.id]);
	// 	if (!userStats)
	// 		throw new InternalServerError();

	// 	return this.formatUserPerformance(userStats, matchesStats);
	// }

	// async getUserMatches(username: string, page: number) {
	// 	const existingUser = await this.userRepository.findByUsername(username);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	const matches = await this.matchesRepository.getMatchesPageByUser_(existingUser.id, page);
	// 	if (!matches)
	// 		throw new InternalServerError();

	// 	return this.formatUserMatchHistory(matches);
	// }

	// private formatUserMatchHistory(matches: any) : IGameHistory[] {
	// 	const result: IGameHistory[] = matches.map((g: any) => ({
	// 		game_id: g.id,
	// 		game_type: g.game_type,
	// 		player_home: {
	// 			username: g.player_home_username,
	// 			avatar: g.player_home_avatar,
	// 			score: g.player_home_score
	// 		},
	// 		player_away : {
	// 			username: g.player_away_username,
	// 			avatar: g.player_away_avatar,
	// 			score: g.player_away_score
	// 		}
	// 	}));

	// 	return result;
	// }

	// private formatUserPerformance(userStats: any, matchesStats: any) : IUserPerformance {
	// 	console.log('UserPerformance: ', userStats, matchesStats);
	// 	const stats = userStats;
	// 	const gamesArray = matchesStats;

	// 	let totalGames = 0;
	// 	let totalWins = 0;
	// 	let totalLosses = 0;
	// 	let totalDraws = 0;

	// 	const pingPongStats = gamesArray.find((g: IGame) => g.game_type === 'PING PONG') || { total_matches: 0, wins: 0, losses: 0, draws: 0 };
	// 	const ticTacToeStats = gamesArray.find((g: IGame) => g.game_type === 'TICTACTOE') || { total_matches: 0, wins: 0, losses: 0, draws: 0 };

	// 	totalGames += pingPongStats.total_matches + ticTacToeStats.total_matches;
	// 	totalWins += pingPongStats.wins + ticTacToeStats.wins;
	// 	totalLosses += pingPongStats.losses + ticTacToeStats.losses;
	// 	totalDraws += pingPongStats.draws + ticTacToeStats.draws;

	// 	const gWinRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
	// 	const pWinRate = pingPongStats.total_matches > 0 ? (pingPongStats.wins / pingPongStats.total_matches) * 100 : 0;
	// 	const tWinRate = ticTacToeStats.total_matches > 0 ? (ticTacToeStats.wins / ticTacToeStats.total_matches) * 100 : 0;

	// 	const result: IUserPerformance = {
	// 		level: stats.level,
	// 		xp: stats.total_xp,
	// 		rank: stats.level, // TODO
	// 		win_rate: parseFloat(gWinRate.toFixed(2)),
	// 		current_streak: stats.current_streak,
	// 		longest_streak: stats.longest_streak,
	// 		games: {
	// 			games: totalGames,
	// 			wins: totalWins,
	// 			losses: totalLosses,
	// 			draws: totalDraws,
	// 			ping_pong: {
	// 				games: pingPongStats.total_matches,
	// 				wins: pingPongStats.wins,
	// 				losses: pingPongStats.losses,
	// 				draws: pingPongStats.draws,
	// 				win_rate: pWinRate
	// 			},
	// 			tic_tac_toe: {
	// 				games: ticTacToeStats.total_matches,
	// 				wins: ticTacToeStats.wins,
	// 				losses: ticTacToeStats.losses,
	// 				draws: ticTacToeStats.draws,
	// 				win_rate: tWinRate
	// 			}
	// 		}
	// 	};

	// 	return result;
	// }
}

export default StatsService;