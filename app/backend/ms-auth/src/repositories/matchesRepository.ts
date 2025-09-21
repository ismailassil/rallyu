import { db } from "../database";
import { InternalServerError } from "../types/auth.types";

class MatchesRepository {

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

	async getMatchesByUser(
		user_id: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		try {
			const countCTE = this.buildUserMatchesCTE(user_id, timeFilter, gameTypeFilter);
			const countResult = await db.get(`
				${countCTE.sql}
				SELECT COUNT(*) as total_count FROM user_matches
			`, countCTE.params);

			const CTE = this.buildUserMatchesCTE(user_id, timeFilter, gameTypeFilter, paginationFilter);

			console.info('Running the following SQL: ', `
				${CTE.sql}
				SELECT * FROM user_matches
			`, 'with params: ', CTE.params);

			const matchesResults = await db.all(`
				${CTE.sql}
				SELECT * FROM user_matches
			`, CTE.params);

			// pagination meta data
			let pagination = null;
			if (paginationFilter) {
				const { page, limit } = paginationFilter;
				const totalPages = Math.ceil(countResult.total_count / limit);

				pagination = {
					current_page: page,
					per_page: limit,
					total: countResult.total_count,
					total_pages: totalPages,
					has_next: page < totalPages,
					has_prev: page > 1,
					next_page: page < totalPages ? page + 1 : null,
					prev_page: page > 1 ? page - 1 : null
				}
			}
			return pagination ? { matches: matchesResults, pagination } : matchesResults;
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

function colorizeParam(param: any): string {
	if (typeof param === "number") return `\x1b[33m${param}\x1b[0m`; // yellow for numbers
	if (typeof param === "string") return `\x1b[32m'${param}'\x1b[0m`; // green for strings
	if (param === null) return `\x1b[31mNULL\x1b[0m`; // red for null
	return `\x1b[35m${param}\x1b[0m`; // magenta fallback
}

function interpolateSQL(sql: string, params: any[]): string {
	let i = 0;
	return sql.replace(/\?/g, () => {
		if (i >= params.length) return "?"; // extra ?
		return colorizeParam(params[i++]);
	});
}

async function test() {
	await db.connect('../database/database.db');

	const matchesRepo = new MatchesRepository();
	// const { sql, params } = matchesRepo.buildUserMatchesCTE(1337, 'all', 'XO', { page: 1, limit: 7 });

	// const interpolated = interpolateSQL(sql, params);

	// console.log("SQL (with params colored):\n", interpolated);
	// console.log("\nRaw params array:", params);

	// const matches = await matchesRepo.getMatchesByUser(1337, '7d', 'all');
	// const stats = await matchesRepo.getUserStats(8, 'all', 'all');
	// const detailedStats = await matchesRepo.getUserDetailedStats(8, 'all', 'all');
	// const trendsGroupedByDay = await matchesRepo.getUserDetailedAnalyticsGroupedByDay(8, 'PING PONG', 7);

	// console.log('Matches:', matches);
	// console.log('Stats:', stats);
	// console.log('DetailesStats:', detailedStats);
	// console.log('TrendsGroupedByDay:', trendsGroupedByDay);
}

// test();

export default MatchesRepository;