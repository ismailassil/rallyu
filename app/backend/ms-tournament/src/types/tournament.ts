/**
 * Represents Tournament Model Schema
 */
export interface TournamentSchema {
	id: number;
	title: string;
	host_id: number;
	mode: string;
	contenders_size: number;
	contenders_joined: number;
	state?: string;
	start_date: string;
	notified: number;
	isUserIn?: boolean;
}

/**
 * Represents TournamentMatches Model Schema
 */
export interface TournamentMatchesSchema {
	id: number;
	tournament_id: number;
	player_1: number;
	player_2: number;
	player_1_ready: number;
	player_2_ready: number;
	winner: number;

	// ** Result of the match in the following format '5|7'
	results: string;
	stage: string;
	stage_number: number;
}

/**
 * Represents Nats subscription payload related to notification service
 */
export interface NOTIFY_USER_PAYLOAD {
	senderId: number;
	receiverId: number;
	type: string;
	message?: string;
	actionUrl?: string;
}

/**
 * Represents some particular fields type returned
 * from a joining relation between tournament table
 * and tournamentMatches table
 */
export interface notifcationTournamentStart {
	id: number,
	host_id: number,
	player_1: number,
	player_2: number,
}