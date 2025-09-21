import { InternalServerError } from "../types/auth.types";
import { db } from "../database";

class StatsRepository {
	async create(userID: number) {
		try {
			const runResult = await db.run(
				`INSERT INTO users_stats (user_id)
					VALUES (?)`,
				[userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserRecords(
		user_id: number
	) {
		try {
			const records = await db.get(`
				SELECT
					level,
					total_xp,
					current_streak,
					longest_streak
				FROM users_stats
				WHERE user_id = ?
			`, [user_id]);

			return records;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserStats(
		user_id: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all'
	) {

		try {
			const CTE = this.buildUserMatchesCTE(user_id, timeFilter, gameTypeFilter);

			const stats = await db.get(`
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

			return stats;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserDetailedAnalyticsGroupedByDay(
		user_id: number,
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all',
		lastAvailableDaysCount: number
	) {
		try {
			const CTE = this.buildUserMatchesCTE(user_id, 'all', gameTypeFilter);

			const detailedStatsGroupedByDay = await db.all(`
				${CTE.sql}
				SELECT 
					date(finished_at) as day,

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
				ORDER BY day DESC
				LIMIT ${lastAvailableDaysCount}
			`, CTE.params);

			return detailedStatsGroupedByDay;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserDetailedAnalytics(
		user_id: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all'
	) {

		try {
			const CTE = this.buildUserMatchesCTE(user_id, timeFilter, gameTypeFilter);

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
					uniqueOpponents,
					mostFrequentOpponent,
					mostWinsOpponent,
					mostLossesOpponent,
					mostDrawsOpponent,
					mostScoredAgainstOpponent,
					mostConcededToOpponent,
				}
			};
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	private TIMEPERIODS = {
		'0d': '',
		'1d': '-1 days',
		'7d': '-7 days',
		'30d': '-30 days',
		'90d': '-90 days',
		'1y': '-1 year'
	}

	buildUserMatchesCTE(
		user_id: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all',
		paginationFilter?: { page: number, limit: number }
	) : { sql: string, params: any[] } {
		const timeCondition = 
			timeFilter === 'all' ? '' :
			timeFilter === '0d' ? `AND date(m.finished_at) = date('now')` : `AND date(m.finished_at) >= date('now', ?)`;

		const gameTypeCondition = 
			gameTypeFilter === 'all' ? '' : `AND game_type = ?`;
		
		const paginationCondition = 
			paginationFilter ? 'LIMIT ? OFFSET ?' : '';
		
		const params: any[] = [
			user_id, user_id, user_id, user_id, user_id,
			user_id, user_id, user_id, user_id, user_id
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
					CASE WHEN m.player_home_id = ? THEN m.player_home_score ELSE m.player_away_score END AS user_score,
					CASE WHEN m.player_home_id = ? THEN m.player_away_score ELSE m.player_home_score END AS opp_score,
					u_opp.id AS opponent_id,
					u_opp.username AS opponent_username,
					(strftime('%s', m.finished_at) - strftime('%s', m.started_at)) AS duration,
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