import { db } from "../database";
import ARepository from "./ARepository";

interface UserStats {
	id: number;
	level: number;
	total_xp: number;
	current_streak: number;
	longest_streak: number;
	user_id: number;
}

interface MatchFilterOptions {
	timeFilter?: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all';
	gameTypeFilter?: 'PONG' | 'XO' | 'all';
	paginationFilter?: { page: number, limit: number };
}

class StatsRepository extends ARepository {

	/**
	 * Create a new stats record for a user.
	 * @param userID - ID of the user.
	 * @returns The ID of the newly created stats record.
	 */
	async create(userID: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`INSERT INTO users_stats (user_id) VALUES (?)`,
				[userID]
			);
			return runResult.lastID!;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating stats record');
		}
		return -1;
	}

	/**
	 * Find stats by user ID.
	 * @param userID - ID of the user.
	 * @returns The stats object if found, otherwise null.
	 */
	async findByUserID(userID: number) : Promise<UserStats | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM users_stats WHERE user_id = ?`,
				[userID]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding stats by user ID');
		}
		return null;
	}

	/**
	 * Get leaderboard of users based on total XP.
	 * @param paginationFilter - Pagination options.
	 * @returns Array of user stats ordered by total XP.
	 */
	async getRankByXP(paginationFilter?: { page: number, limit: number }) : Promise<any[]> {
		const paginationCondition = paginationFilter ? 'LIMIT ? OFFSET ?' : '';
		const params = paginationFilter ? [paginationFilter.limit, (paginationFilter.page - 1) * paginationFilter.limit] : [];

		try {
			const rankByXP = await db.all(`
				SELECT 
					ROW_NUMBER() OVER (ORDER BY s.total_xp DESC, u.id ASC) AS rank,
					u.username,
					u.avatar_url,
					s.level,
					s.total_xp,
					u.id
				FROM users_stats s
				JOIN users u ON s.user_id = u.id
				ORDER BY rank
				${paginationCondition};
			`, params);

			return rankByXP;
		} catch (err: any) {
			this.handleDatabaseError(err, 'getting rank by XP');
		}
		return [];
	}

	/**
	 * Get user records (rank, level, total XP, current streak, longest streak).
	 * @param userID - ID of the user.
	 * @returns User records object if found, otherwise null.
	 */
	async getUserRecords(userID: number) : Promise<any | null> {
		try {
			const userRecords = await db.get(`
				WITH ranked_users AS (
					SELECT
						ROW_NUMBER() OVER (ORDER BY total_xp DESC) as rank,
						level,
						total_xp,
						current_streak,
						longest_streak,
						user_id
					FROM users_stats
				)
				SELECT 
					rank,
					level,
					total_xp,
					current_streak,
					longest_streak
				FROM ranked_users
				WHERE user_id = ?
			`, [userID]);

			return userRecords ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'getting user records');
		}
		return null;
	}

	/**
	 * Get user stats.
	 * @param userID - ID of the user.
	 * @param timeFilter - Time filter for matches ('0d', '1d', '7d', '30d', '90d', '1y', 'all').
	 * @param gameTypeFilter - Game type filter ('PONG', 'XO', 'all').
	 * @returns Stats object containing matches, wins, losses, draws, win_rate, duration.
	 */
	async getUserStats(
		userID: number, 
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all'
	) : Promise<any> {

		try {
			const CTE = this.buildUserMatchesCTE(userID, { timeFilter, gameTypeFilter });
	
			const userStats = await db.get(`
				${CTE.sql}
				SELECT
					COUNT(*) AS matches,
	
					COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) AS wins,
					COALESCE(SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END), 0) AS losses,
					COALESCE(SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END), 0) AS draws,
	
					CASE
						WHEN COUNT(*) = 0 THEN 0
						ELSE ROUND(100.00 * COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) / COUNT(*), 2)
					END AS win_rate,
	
					COALESCE(SUM(duration), 0) AS duration
				FROM user_matches
			`, CTE.params);
	
			return userStats ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'getting user stats');
		}
		return null;
	}

	/**
	 * Get detailed user analytics grouped by day.
	 * @param userID - ID of the user.
	 * @param gameTypeFilter - Game type filter ('PONG', 'XO', 'all').
	 * @param lastAvailableDaysCount - Number of last days to include in the analytics.
	 * @returns Array of detailed analytics objects grouped by day.
	 */
	async getUserDetailedAnalyticsGroupedByDay(
		userID: number,
		gameTypeFilter: 'PONG' | 'XO' | 'all',
		lastAvailableDaysCount: number
	) {
		try {
			const CTE = this.buildUserMatchesCTE(userID, { timeFilter: 'all', gameTypeFilter });

			const detailedStatsGroupedByDay = await db.all(`
				${CTE.sql}
				SELECT 
					date(finished_at, 'unixepoch') as day,

					COUNT(*) AS matches,

					COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) AS wins,
					COALESCE(SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END), 0) AS losses,
					COALESCE(SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END), 0) AS draws,

					CASE
						WHEN COUNT(*) = 0 THEN 0
						ELSE ROUND(100.00 * COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) / COUNT(*), 2)
					END AS win_rate,

					COALESCE(SUM(user_score), 0) AS total_user_score,
					COALESCE(MAX(user_score), 0) AS max_user_score,
					COALESCE(MIN(user_score), 0) AS min_user_score,
					ROUND(COALESCE(AVG(user_score), 0), 2) AS avg_user_score,

					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN user_score ELSE NULL END), 0), 2) AS avg_user_win_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN user_score ELSE NULL END), 0), 2) AS avg_user_loss_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN user_score ELSE NULL END), 0), 2) AS avg_user_draw_score,
					
					COALESCE(SUM(opp_score), 0) AS total_opp_score,
					COALESCE(MAX(opp_score), 0) AS max_opp_score,
					COALESCE(MIN(opp_score), 0) AS min_opp_score,
					ROUND(COALESCE(AVG(opp_score), 0), 2) AS avg_opp_score,
					
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_win_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_loss_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_draw_score,

					COALESCE(SUM(duration), 0) AS total_duration,
					COALESCE(MAX(duration), 0) AS max_duration,
					COALESCE(MIN(duration), 0) AS min_duration,
					ROUND(COALESCE(AVG(duration), 0), 2) AS avg_duration,

					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN duration ELSE NULL END), 0), 2) AS avg_user_win_duration,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN duration ELSE NULL END), 0), 2) AS avg_user_loss_duration,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN duration ELSE NULL END), 0), 2) AS avg_user_draw_duration
				FROM user_matches
				GROUP BY day
				ORDER BY day ASC
				LIMIT ${lastAvailableDaysCount}
			`, CTE.params);

			return detailedStatsGroupedByDay;
		} catch (err: any) {
			this.handleDatabaseError(err, 'getting user detailed analytics grouped by day');
		}
		return [];
	}

	/**
	 * Get detailed user analytics.
	 * @param userID - ID of the user.
	 * @param timeFilter - Time filter for matches ('0d', '1d', '7d', '30d', '90d', '1y', 'all').
	 * @param gameTypeFilter - Game type filter ('PONG', 'XO', 'all').
	 * @returns Detailed analytics object including totals, scores, durations, and opponent stats.
	 */
	async getUserDetailedAnalytics(
		userID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all'
	) {
		try {
			const CTE = this.buildUserMatchesCTE(userID, { timeFilter, gameTypeFilter });

			const detailedStats = await db.get(`
				${CTE.sql}
				SELECT 
					COUNT(*) AS matches,

					COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) AS wins,
					COALESCE(SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END), 0) AS losses,
					COALESCE(SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END), 0) AS draws,

					CASE
						WHEN COUNT(*) = 0 THEN 0
						ELSE ROUND(100.00 * COALESCE(SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END), 0) / COUNT(*), 2)
					END AS win_rate,

					COALESCE(SUM(user_score), 0) AS total_user_score,
					COALESCE(MAX(user_score), 0) AS max_user_score,
					COALESCE(MIN(user_score), 0) AS min_user_score,
					ROUND(COALESCE(AVG(user_score), 0), 2) AS avg_user_score,

					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN user_score ELSE NULL END), 0), 2) AS avg_user_win_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN user_score ELSE NULL END), 0), 2) AS avg_user_loss_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN user_score ELSE NULL END), 0), 2) AS avg_user_draw_score,
					
					COALESCE(SUM(opp_score), 0) AS total_opp_score,
					COALESCE(MAX(opp_score), 0) AS max_opp_score,
					COALESCE(MIN(opp_score), 0) AS min_opp_score,
					ROUND(COALESCE(AVG(opp_score), 0), 2) AS avg_opp_score,
					
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_win_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_loss_score,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN opp_score ELSE NULL END), 0), 2) AS avg_opp_draw_score,

					COALESCE(SUM(duration), 0) AS total_duration,
					COALESCE(MAX(duration), 0) AS max_duration,
					COALESCE(MIN(duration), 0) AS min_duration,
					ROUND(COALESCE(AVG(duration), 0), 2) AS avg_duration,

					ROUND(COALESCE(AVG(CASE WHEN outcome = 'W' THEN duration ELSE NULL END), 0), 2) AS avg_user_win_duration,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'L' THEN duration ELSE NULL END), 0), 2) AS avg_user_loss_duration,
					ROUND(COALESCE(AVG(CASE WHEN outcome = 'D' THEN duration ELSE NULL END), 0), 2) AS avg_user_draw_duration
				FROM user_matches
			`, CTE.params);

			const uniqueOpponents = await db.get(`
				${CTE.sql}
				SELECT
					COUNT(DISTINCT opponent_id) AS unique_opponents
				FROM user_matches
			`, CTE.params);

			const mostFrequentOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, COUNT(*) as matches
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY matches DESC
				LIMIT 1
			`, CTE.params);
			console.log("mostFreq: ", mostFrequentOpponent);

			const mostWinsOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END) as wins
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY wins DESC
				LIMIT 1
			`, CTE.params);

			const mostLossesOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END) as losses
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY losses DESC
				LIMIT 1
			`, CTE.params);

			const mostDrawsOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END) as draws
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY draws DESC
				LIMIT 1
			`, CTE.params);

			const mostScoredAgainstOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, SUM(user_score) as total_scored
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY total_scored DESC
				LIMIT 1
			`, CTE.params);

			const mostConcededToOpponent = await db.get(`
				${CTE.sql}
				SELECT
					opponent_id, opponent_username, SUM(opp_score) as total_conceded
				FROM user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY total_conceded DESC
				LIMIT 1
			`, CTE.params);

			return {
				totals: {
					matches: detailedStats.matches,
					wins: detailedStats.wins,
					losses: detailedStats.losses,
					draws: detailedStats.draws,
					win_rate: detailedStats.win_rate,
				},
				scores: {
					total_user_score: detailedStats.total_user_score,
					max_user_score: detailedStats.max_user_score,
					min_user_score: detailedStats.min_user_score,
					avg_user_score: detailedStats.avg_user_score,
					avg_user_win_score: detailedStats.avg_user_win_score,
					avg_user_loss_score: detailedStats.avg_user_loss_score,
					avg_user_draw_score: detailedStats.avg_user_draw_score,

					total_opp_score: detailedStats.total_opp_score,
					max_opp_score: detailedStats.max_opp_score,
					min_opp_score: detailedStats.min_opp_score,
					avg_opp_score: detailedStats.avg_opp_score,
					avg_opp_win_score: detailedStats.avg_opp_win_score,
					avg_opp_loss_score: detailedStats.avg_opp_loss_score,
					avg_opp_draw_score: detailedStats.avg_opp_draw_score,
				},
				durations: {
					total_duration: detailedStats.total_duration,
					max_duration: detailedStats.max_duration,
					min_duration: detailedStats.min_duration,
					avg_duration: detailedStats.avg_duration,
					avg_user_win_duration: detailedStats.avg_user_win_duration,
					avg_user_loss_duration: detailedStats.avg_user_loss_duration,
					avg_user_draw_duration: detailedStats.avg_user_draw_duration,
				},
				opponents: {
					uniqueOpponents: uniqueOpponents ?? 0,
					mostFrequentOpponent: mostFrequentOpponent ?? { opponent_id: null, opponent_username: null, matches: 0 },
					mostWinsOpponent: mostWinsOpponent ?? { opponent_id: null, opponent_username: null, wins: 0 },
					mostLossesOpponent: mostLossesOpponent ?? { opponent_id: null, opponent_username: null, losses: 0 },
					mostDrawsOpponent: mostDrawsOpponent ?? { opponent_id: null, opponent_username: null, draws: 0 },
					mostScoredAgainstOpponent: mostScoredAgainstOpponent ?? { opponent_id: null, opponent_username: null, scored: 0 },
					mostConcededToOpponent: mostConcededToOpponent ?? { opponent_id: null, opponent_username: null, conceded: 0 },
				}
			};
		} catch (err: any) {
			this.handleDatabaseError(err, 'getting user detailed analytics');
		}
		return null;
	}


	private TIMEPERIODS = {
		'0d': '',
		'1d': '-1 days',
		'7d': '-7 days',
		'30d': '-30 days',
		'90d': '-90 days',
		'1y': '-1 year'
	}

	buildUserMatchesCTE(userID: number, filters: MatchFilterOptions) : { sql: string, params: any[] } {
		const { timeFilter = 'all', gameTypeFilter = 'all', paginationFilter } = filters;

		const timeCondition = 
			timeFilter === 'all' ? '' :
			timeFilter === '0d' ? `AND date(m.finished_at, 'unixepoch') = date('now')` : `AND date(m.finished_at, 'unixepoch') >= date('now', ?)`;

		const gameTypeCondition = 
			gameTypeFilter === 'all' ? '' : `AND game_type = ?`;
		
		const paginationCondition = 
			paginationFilter ? 'LIMIT ? OFFSET ?' : '';
		
		const params: any[] = [
			userID, userID, userID, userID, userID,
			userID, userID, userID, userID, userID
		];

		if (timeFilter !== 'all' && timeFilter !== '0d')
			params.push(this.TIMEPERIODS[timeFilter]);
		if (gameTypeFilter !== 'all')
			params.push(gameTypeFilter);
		if (paginationFilter) {
			const offset = (paginationFilter.page - 1) * paginationFilter.limit;
			params.push(paginationFilter.limit, offset);
		}



		const SQL = `
			WITH user_matches AS (
				SELECT
					m.id AS match_id,
					m.game_type AS game_type,
					m.started_at,
					m.finished_at,
					u_self.id AS user_id,
					u_self.username AS user_username,
					u_self.avatar_url AS user_avatar_url,
					CASE WHEN m.player_home_id = ? THEN m.player_home_score ELSE m.player_away_score END AS user_score,
					CASE WHEN m.player_home_id = ? THEN m.player_away_score ELSE m.player_home_score END AS opp_score,
					u_opp.id AS opponent_id,
					u_opp.username AS opponent_username,
					u_opp.avatar_url AS opponent_avatar_url,
					(m.finished_at - m.started_at) AS duration,
					CASE
						WHEN (m.player_home_id = ? AND m.player_home_score > m.player_away_score) 
						OR (m.player_away_id = ? AND m.player_away_score > m.player_home_score) THEN 'W'
						WHEN (m.player_home_id = ? AND m.player_home_score < m.player_away_score) 
						OR (m.player_away_id = ? AND m.player_away_score < m.player_home_score) THEN 'L'
						ELSE 'D'
					END AS outcome
				FROM matches m
				JOIN users u_self ON u_self.id = ?
				JOIN users u_opp ON u_opp.id = CASE
					WHEN m.player_home_id = ? THEN m.player_away_id 
					ELSE m.player_home_id
				END
				WHERE (m.player_home_id = ? OR m.player_away_id = ?)
				${timeCondition}
				${gameTypeCondition}
				ORDER BY m.finished_at DESC
				${paginationCondition}
			)
		`;

		return { sql: SQL, params };
	}
}

export default StatsRepository;