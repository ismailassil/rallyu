export interface UserAnalytics {
	totals: {
		matches: number;
		wins: number;
		losses: number;
		draws: number;
		win_rate: number;
	};
	scores: {
		total_user_score: number;
		max_user_score: number;
		min_user_score: number;
		avg_user_score: number;
		avg_user_win_score: number;
		avg_user_loss_score: number;
		avg_user_draw_score: number;
	
		total_opp_score: number;
		max_opp_score: number;
		min_opp_score: number;
		avg_opp_score: number;
		avg_opp_win_score: number;
		avg_opp_loss_score: number;
		avg_opp_draw_score: number;
	};
	durations: {
		total_duration: number;
		max_duration: number;
		min_duration: number;
		avg_duration: number;
		avg_user_win_duration: number;
		avg_user_loss_duration: number;
		avg_user_draw_duration: number;
	};
	opponents: {
		uniqueOpponents: {
			unique_opponents: number;
		};
		mostFrequentOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			matches: number;
		};
		mostWinsOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			wins: number;
		};
		mostLossesOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			losses: number;
		};
		mostDrawsOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			draws: number;
		};
		mostScoredAgainstOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			scored: number;
		};
		mostConcededToOpponent: {
			opponent_id: number | null;
			opponent_username: string | null;
			conceded: number;
		};
	};
}

export interface UserAnalyticsByDay {
	day: string; // e.g. "2025-07-09"

	matches: number;
	wins: number;
	losses: number;
	draws: number;
	win_rate: number;

	total_user_score: number;
	max_user_score: number;
	min_user_score: number;
	avg_user_score: number;
	avg_user_win_score: number;
	avg_user_loss_score: number;
	avg_user_draw_score: number;

	total_opp_score: number;
	max_opp_score: number;
	min_opp_score: number;
	avg_opp_score: number;
	avg_opp_win_score: number;
	avg_opp_loss_score: number;
	avg_opp_draw_score: number;

	total_duration: number;
	max_duration: number;
	min_duration: number;
	avg_duration: number;
	avg_user_win_duration: number;
	avg_user_loss_duration: number;
	avg_user_draw_duration: number;
}
