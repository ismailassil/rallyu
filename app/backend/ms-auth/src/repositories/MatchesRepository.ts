import { db } from "../database";
import ARepository from "./ARepository";

interface Match {
	id: number;
	player_home_score: number;
	player_away_score: number;
	game_type: string;
	started_at: number;
	finished_at: number;
	player_home_id: number;
	player_away_id: number;
	created_at: number;
	updated_at: number;
}

interface MatchFilterOptions {
	timeFilter?: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all';
	gameTypeFilter?: 'PING PONG' | 'XO' | 'all';
	paginationFilter?: { page: number, limit: number } | undefined;
}

/**
 * Repository for matches table database operations.
 * @extends ARepository
 */

class MatchesRepository extends ARepository {

	/**
	 * Find a match by its ID.
	 * @param id - ID of the match.
	 * @returns The match object if found, otherwise null.
	 */
	async findOne(id: number) : Promise<Match | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM matches WHERE id = ?`,
				[id]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new Error('Internal Server Error');
		}
	}

	/**
	 * Create a new match record.
	 * @param player_home_score - Score of the home player.
	 * @param player_away_score - Score of the away player.
	 * @param game_type - Type of the game ('PING PONG', 'XO').
	 * @param player_home_id - ID of the home player.
	 * @param player_away_id - ID of the away player.
	 * @param started - Start time of the match.
	 * @param finished - Finish time of the match.
	 * @returns The ID of the newly created match.
	 */
	async create(player_home_score: number, player_away_score: number, game_type: string, player_home_id: number, player_away_id: number, started_at: number, finished_at: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`INSERT INTO matches 
				(player_home_score, player_away_score, game_type, started_at, finished_at, player_home_id, player_away_id) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[player_home_score, player_away_score, game_type, started_at, finished_at, player_home_id, player_away_id]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating match');
		}
		return -1;
	}

	/**
	 * Update an existing match record.
	 * @param id - ID of the match to update.
	 * @param updates - Object containing fields to update.
	 * @return True if the update was successful, otherwise false.
	 */
	async update(id: number, updates: Partial<Match>) : Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(id);

			const runResult = await db.run(
				`UPDATE matches SET ${setClause}, updated_at = (strftime('%s','now')) WHERE id = ?`,
				values
			);

			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating match');
		}
		return false;
	}

	/**
	 * Delete a match by its ID.
	 * @param id - ID of the match to delete.
	 * @return The number of rows affected.
	 */
	async delete(id: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM matches WHERE id = ?`,
				[id]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting match');
		}
		return 0;
	}

	/**
	 * Get matches involving a specific user with optional filters and pagination.
	 * @param userID - ID of the user.
	 * @param timeFilter - Time filter for matches ('0d', '1d', '7d', '30d', '90d', '1y', 'all').
	 * @param gameTypeFilter - Game type filter ('PING PONG', 'XO', 'all').
	 * @param paginationFilter - Pagination options ({ page: number, limit: number }).
	 * @returns An object containing array of matches and pagination metadata.
	 */
	async findAll(userID: number, filters: MatchFilterOptions) : Promise<{ matches: Match[], pagination: { total: number, page: number, limit: number, totalPages: number } }> {
		try {
			const { timeFilter = 'all', gameTypeFilter = 'all', paginationFilter } = filters;

			const countCTE = this.buildUserMatchesCTE(userID, filters);
			const countResult = await db.get(`
				${countCTE.sql}
				SELECT COUNT(*) as total_count FROM user_matches
			`, countCTE.params);

			const CTE = this.buildUserMatchesCTE(userID, filters);

			const matchesResults = await db.all(`
				${CTE.sql}
				SELECT * FROM user_matches
			`, CTE.params);

			const totalMatches = countResult?.total_count ?? 0;
			const page = paginationFilter?.page ?? 1;
			const limit = paginationFilter?.limit ?? totalMatches;
			const totalPages = Math.ceil(totalMatches / limit) || 1;

			return {
				matches: matchesResults as Match[],
				pagination: {
					total: totalMatches,
					page,
					limit,
					totalPages
				}
			};
		} catch (err: any) {
			this.handleDatabaseError(err, 'retrieving matches for user');
		}
		return { matches: [], pagination: { total: 0, page: 1, limit: 0, totalPages: 0 } };
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
			timeFilter === '0d' ? `AND date(m.finished_at) = date('now')` : `AND date(m.finished_at) >= date('now', ?)`;

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

export default MatchesRepository;