export interface fetchUserSuccessAPIResponse {
	user: User;
	currentRelationship: string;
	userRecords: UserRecords;
	userStats: UserStats;
	userRecentMatches: UserRecentMatch[];
}

export type UserProfile = fetchUserSuccessAPIResponse;

export interface User {
	id: number;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	bio: string;
	avatar_url: string;
	avatar_path: string;
	auth_provider: string;
	role: string;
	created_at: string; // ISO-like datetime
	updated_at: string; // ISO-like datetime
}

export interface UserRecords {
	level: number;
	total_xp: number;
	current_streak: number;
	longest_streak: number;
}

export interface UserStats {
	matches: number;
	wins: number;
	losses: number;
	draws: number;
	win_rate: number; // percentage
	duration: number; // total seconds
}

export interface UserRecentMatch {
	match_id: number;
	game_type: string;
	started_at: string;
	finished_at: string;
	user_id: number;
	user_username: string;
	user_score: number;
	opp_score: number;
	opponent_id: number;
	opponent_username: string;
	duration: number; // seconds
	outcome: string; // "W" | "L" | "D" if constrained
}
