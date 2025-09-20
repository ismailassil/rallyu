import { time } from "console";
import { db } from "../database";
import { InternalServerError } from "../types/auth.types";

class MatchesRepository {
	private TMPTABLE = `
		CREATE TEMP TABLE tmp_user_matches AS
			WITH user_matches AS (
				SELECT
					m.id AS match_id,
					m.started_at,
					m.finished_at,
					CASE WHEN m.player_home_id = ? THEN m.player_home_score ELSE m.player_away_score END AS user_score,
					CASE WHEN m.player_home_id = ? THEN m.player_away_score ELSE m.player_home_score END AS opp_score,
					CASE WHEN m.player_home_id = ? THEN m.player_away_id ELSE m.player_home_id END AS opponent_id,
					(strftime('%s', m.finished_at) - strftime('%s', m.started_at)) AS duration,
					CASE
						WHEN (m.player_home_id = ? AND m.player_home_score > m.player_away_score) 
						OR (m.player_away_id = ? AND m.player_away_score > m.player_home_score) THEN 'W'
						WHEN (m.player_home_id = ? AND m.player_home_score < m.player_away_score) 
						OR (m.player_away_id = ? AND m.player_away_score < m.player_home_score) THEN 'L'
						ELSE 'D'
					END AS outcome,
					u.username AS opponent_username
				FROM matches m
				JOIN users u
				ON u.id = CASE
							WHEN m.player_home_id = ? THEN m.player_away_id
							ELSE m.player_home_id
							END
				WHERE m.player_home_id = ? OR m.player_away_id = ?
			)
			SELECT * FROM user_matches;
	`;

	private TIMEPERIODS = {
		'0d': '',
		'1d': '-1 days',
		'7d': '-7 days',
		'30d': '-30 days',
		'90d': '-90 days',
		'1y': '-1 year'
	}

	async create(
		player_home_score: number,
		player_away_score: number,
		game_type: string,
		player_home_id: number,
		player_away_id: number,
		started?: string,
		finished?: string
	) : Promise<number> {
		const startedVal = started ?? new Date().toISOString();
		const finishedVal = finished ?? new Date().toISOString();

		try {
			const runResult = await db.run(
				`INSERT INTO matches 
				(player_home_score, player_away_score, game_type, started_at, finished_at, player_home_id, player_away_id) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[player_home_score, player_away_score, game_type, startedVal, finishedVal, player_home_id, player_away_id]
			);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findById(match_id: number) {
		try {
			const result = await db.get(
				`SELECT * FROM matches WHERE id = ?`,
				[match_id]
			);
			return result ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getAllMatchesByUser(user_id: number) : Promise<any | null> {
		try {
			const results = await db.all(
				`SELECT * FROM matches WHERE player_home_id = ? OR player_away_id = ?`,
				[user_id, user_id]
			);
			return results;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getMatchesPageByUser(user_id: number, page: number) : Promise<any | null> {
		const offset = (page - 1) * 5;
		try {
			const results = await db.all(
				`SELECT * FROM matches WHERE player_home_id = ? OR player_away_id = ?
					ORDER BY started_at DESC
						LIMIT 5 OFFSET ?`,
				[user_id, user_id, offset]
			);
			return results;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getMatchesPageByUser_(user_id: number, page: number) : Promise<any | null> {
		const offset = (page - 1) * 5;
		try {
			const results = await db.all(`
				SELECT	uh.username AS player_home_username,
						uh.avatar_url AS player_home_avatar,
						ua.username AS player_away_username,
						ua.avatar_url AS player_away_avatar,
						m.*
					FROM matches m
				JOIN users uh ON (m.player_home_id = uh.id)
				JOIN users ua ON (m.player_away_id = ua.id)
				WHERE (m.player_home_id = ? OR m.player_away_id = ?)`,
				[user_id, user_id]
			);
			return results;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// this should be separated
	async getUserPerformance(user_id: number) : Promise<any | null> {
		try {
			const TMPTABLESQL = this.getTMPTABLESQL('all', 'all', 1);

			await db.run('DROP TABLE IF EXISTS tmp_user_matches;');

			const matches_stats = await db.get(`
				SELECT
					COUNT(*) AS total_matches,
					COALESCE(SUM(CASE WHEN (player_home_id = ? AND player_home_score > player_away_score) OR (player_away_id = ? AND player_away_score > player_home_score) THEN 1 ELSE 0 END), 0) AS total_wins,
					COALESCE(SUM(CASE WHEN (player_home_id = ? AND player_home_score < player_away_score) OR (player_away_id = ? AND player_away_score < player_home_score) THEN 1 ELSE 0 END), 0) AS total_losses,
					COALESCE(SUM(CASE WHEN (player_home_id = ? AND player_home_score = player_away_score) OR (player_away_id = ? AND player_away_score = player_home_score) THEN 1 ELSE 0 END), 0) AS total_draws,
					100.00 * COALESCE(SUM(CASE WHEN (player_home_id = ? AND player_home_score > player_away_score) OR (player_away_id = ? AND player_away_score > player_home_score) THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(*), 0), 0) AS win_rate
				FROM matches
				WHERE (player_home_id = ? OR player_away_id = ?)
			`, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

			const user_stats = await db.get(`
				SELECT
					level, total_xp, current_streak, longest_streak
				FROM users_stats
				WHERE user_id = ?
			`, [user_id]);

			return { ...user_stats, ...matches_stats };
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserRecentMatches(user_id: number) : Promise<any | null> {
		try {
			const TMPTABLESQL = this.getTMPTABLESQL('all', 'all', 1);

			await db.run('DROP TABLE IF EXISTS tmp_user_matches;');
			await db.run(TMPTABLESQL, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

			const result = await db.all(`SELECT * FROM tmp_user_matches`);

			return result;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserMatches(
		user_id: number, 
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all',
		pageFilter: number
	) : Promise<any | null> {
		try {
			const TMPTABLESQL = this.getTMPTABLESQL(timeFilter, gameTypeFilter, pageFilter);

			console.log('TMP TABLE SQL: ', TMPTABLESQL);
			await db.run('DROP TABLE IF EXISTS tmp_user_matches;');
			await db.run(TMPTABLESQL, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

			const result = await db.all(`SELECT * FROM tmp_user_matches`);

			return result;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async getUserFullStats(
		user_id: number, 
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all'
	) : Promise<any | null> {

		
		// `match_id	started_at	finished_at	user_score	opp_score	opponent_id	opponent_username	duration	outcome`;
		try {
			const TMPTABLESQL = this.getTMPTABLESQL(timeFilter, gameTypeFilter);

			await db.run('DROP TABLE IF EXISTS tmp_user_matches;');
			console.log('TMP TABLE SQL: ', TMPTABLESQL);
			await db.run(TMPTABLESQL, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

			// matches | wins | losses | draws | win_rate
			// total/max/min/avg user score | total/max/min/avg opp score
			// avg user score by outcome | avg opp score by outcome | avg duration by outcome

			const stats = await db.get(`
				SELECT 
					COUNT(*) AS matches,

					SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END) AS wins,
					SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END) AS losses,
					SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END) AS draws,

					100.00 * SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END) / COUNT(*) AS win_rate,

					SUM(user_score) AS total_user_score,
					MAX(user_score) AS max_user_score,
					MIN(user_score) AS min_user_score,
					AVG(user_score) AS avg_user_score,

					AVG(CASE WHEN outcome = 'W' THEN user_score ELSE NULL END) AS avg_user_win_score,
					AVG(CASE WHEN outcome = 'L' THEN user_score ELSE NULL END) AS avg_user_loss_score,
					AVG(CASE WHEN outcome = 'D' THEN user_score ELSE NULL END) AS avg_user_draw_score,
					
					SUM(opp_score) AS total_opp_score,
					MAX(opp_score) AS max_opp_score,
					MIN(opp_score) AS min_opp_score,
					AVG(opp_score) AS avg_opp_score,
					
					AVG(CASE WHEN outcome = 'W' THEN opp_score ELSE NULL END) AS avg_opp_win_score,
					AVG(CASE WHEN outcome = 'L' THEN opp_score ELSE NULL END) AS avg_opp_loss_score,
					AVG(CASE WHEN outcome = 'D' THEN opp_score ELSE NULL END) AS avg_opp_draw_score,

					SUM(duration) AS total_duration,
					MAX(duration) AS max_duration,
					MIN(duration) AS min_duration,
					AVG(duration) AS avg_duration,

					AVG(CASE WHEN outcome = 'W' THEN duration ELSE NULL END) AS avg_user_win_duration,
					AVG(CASE WHEN outcome = 'L' THEN duration ELSE NULL END) AS avg_user_loss_duration,
					AVG(CASE WHEN outcome = 'D' THEN duration ELSE NULL END) AS avg_user_draw_duration
				FROM tmp_user_matches
			`);

			const uniqueOpponents = await db.get(`
				SELECT
					COUNT(DISTINCT opponent_id) AS unique_opponents
				FROM tmp_user_matches
			`);

			const mostFrequentOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, COUNT(*) as matches
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY matches DESC
				LIMIT 1
			`);

			const mostWinsOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'W' THEN 1 ELSE 0 END) as wins
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY wins DESC
				LIMIT 1
			`);

			const mostLossesOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'L' THEN 1 ELSE 0 END) as losses
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY losses DESC
				LIMIT 1
			`);

			const mostDrawsOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, SUM(CASE WHEN outcome = 'D' THEN 1 ELSE 0 END) as draws
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY draws DESC
				LIMIT 1
			`);

			const mostScoredAgainstOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, SUM(user_score) as total_scored
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY total_scored DESC
				LIMIT 1
			`);

			const mostConcededToOpponent = await db.get(`
				SELECT
					opponent_id, opponent_username, SUM(opp_score) as total_conceded
				FROM tmp_user_matches
				GROUP BY opponent_id, opponent_username
				ORDER BY total_conceded DESC
				LIMIT 1
			`);

			return {
				totals: {
					matches: stats.matches,
					wins: stats.wins,
					losses: stats.losses,
					draws: stats.draws,
					win_rate: stats.win_rate,
				},
				scores: {
					total_user_score: stats.total_user_score,
					max_user_score: stats.max_user_score,
					min_user_score: stats.min_user_score,
					avg_user_score: stats.avg_user_score,
					avg_user_win_score: stats.avg_user_win_score,
					avg_user_loss_score: stats.avg_user_loss_score,
					avg_user_draw_score: stats.avg_user_draw_score,

					total_opp_score: stats.total_opp_score,
					max_opp_score: stats.max_opp_score,
					min_opp_score: stats.min_opp_score,
					avg_opp_score: stats.avg_opp_score,
					avg_opp_win_score: stats.avg_opp_win_score,
					avg_opp_loss_score: stats.avg_opp_loss_score,
					avg_opp_draw_score: stats.avg_opp_draw_score,
				},
				durations: {
					total_duration: stats.total_duration,
					max_duration: stats.max_duration,
					min_duration: stats.min_duration,
					avg_duration: stats.avg_duration,
					avg_user_win_duration: stats.avg_user_win_duration,
					avg_user_loss_duration: stats.avg_user_loss_duration,
					avg_user_draw_duration: stats.avg_user_draw_duration,
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
			}

		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// private getTMPTABLESQL(
	// 	timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
	// 	gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all',
	// 	pageFilter?: number
	// ) : string {

	// 	const timeCondition = timeFilter === 'all' ? '' : timeFilter === '0d' ? `AND date(finished_at) = date('now')`
	// 		: `AND date(finished_at) >= date('now', '${this.TIMEPERIODS[timeFilter]}')`;
 	// 	const gameTypeCondition = gameTypeFilter === 'all' ? '' : `AND game_type = '${gameTypeFilter}'`;
	// 	const pageCondition = pageFilter ? `ORDER BY finished_at LIMIT ${pageFilter * 2} OFFSET ${(pageFilter - 1) * 2}` : '';
	// 	const whereClause = timeCondition + gameTypeCondition + pageCondition;

	// // +----------+------------+-------------+---------+---------------+------------+----------+-------------+-------------------+----------+---------+
	// // | match_id | started_at | finished_at | user_id | user_username | user_score | opp_score| opponent_id | opponent_username | duration | outcome |
	// // +----------+------------+-------------+---------+---------------+------------+----------+-------------+-------------------+----------+---------+

	// 	const SQL = `
	// 		CREATE TEMP TABLE tmp_user_matches AS
	// 		WITH user_matches AS (
	// 			SELECT
	// 				m.id AS match_id,
	// 				m.game_type AS game_type,
	// 				m.started_at,
	// 				m.finished_at,
	// 				u_self.id AS user_id,
	// 				u_self.username AS user_username,
	// 				CASE WHEN m.player_home_id = ? THEN m.player_home_score ELSE m.player_away_score END AS user_score,
	// 				CASE WHEN m.player_home_id = ? THEN m.player_away_score ELSE m.player_home_score END AS opp_score,
	// 				u_opp.id AS opponent_id,
	// 				u_opp.username AS opponent_username,
	// 				(strftime('%s', m.finished_at) - strftime('%s', m.started_at)) AS duration,
	// 				CASE
	// 					WHEN (m.player_home_id = ? AND m.player_home_score > m.player_away_score) 
	// 					OR (m.player_away_id = ? AND m.player_away_score > m.player_home_score) THEN 'W'
	// 					WHEN (m.player_home_id = ? AND m.player_home_score < m.player_away_score) 
	// 					OR (m.player_away_id = ? AND m.player_away_score < m.player_home_score) THEN 'L'
	// 					ELSE 'D'
	// 				END AS outcome
	// 			FROM matches m
	// 			JOIN users u_self
	// 				ON u_self.id = ?
	// 			JOIN users u_opp
	// 				ON u_opp.id = CASE
	// 								WHEN m.player_home_id = ? THEN m.player_away_id ELSE m.player_home_id
	// 					  		  END

	// 			WHERE (m.player_home_id = ? OR m.player_away_id = ?)
	// 			${whereClause}
	// 		)
	// 		SELECT * FROM user_matches;
	// 	`;

	// 	return SQL;
	// }

	private buildUserMatchesCTE(
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
			user_id, user_id, user_id, user_id
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
			)
			SELECT *
			FROM user_matches
			ORDER BY finished_at DESC
			${paginationCondition};
		`;

		return { sql: SQL, params };
	}
}

export default MatchesRepository;