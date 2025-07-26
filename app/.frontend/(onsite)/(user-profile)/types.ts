/*
	-- USER INFO
		- FIRST NAME
		- LAST NAME
		- AVATAR
	-- USER STATS
		- LEVEL
		- RANK
		- WIN RATE
		- CURRENT STREAK
	-- PERFORMANCE
		- TOTAL XP
		- TOTAL GAMES
		- LONGEST STREAK
		- PING PONG GAMES
		- TICTACTOE GAMES
		- TOTAL WINS, LOSSES, DRAWS
		- PINGPONG/TICTACTOE WINS, LOSSES DRAWS
		- PLAYTIME
	-- GAMES HISTORY
		- PLAYERS (USERNAMES, AVATARS)
		- SCORES
		- GAME TYPE
		- XP GAIN
*/

export interface IUserPerformance {
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

export interface IGameHistory {
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

export interface IUserInfo {
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	bio: string,
	avatar_url: string,
	role: string
}

export interface IUserProfile {
	profile: IUserInfo,
	performance: IUserPerformance,
	games_history: Array<IGameHistory>
}