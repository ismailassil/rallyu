import { secondsToMinutes } from "@/app/(api)/utils";

export const STAT_CONFIG = {
	total_xp: { label: "Total XP", suffix: " XP", decimals: 0 },
	win_rate: { label: "Win Rate", suffix: "%", decimals: 2 },
	current_streak: { label: "Current Streak", suffix: "", decimals: 0 },
	longest_streak: { label: "Longest Streak", suffix: "", decimals: 0 },

	matches: { label: "Games Played", suffix: "", decimals: 0 },
	wins: { label: "Games Won", suffix: "", decimals: 0 },
	losses: { label: "Games Lost", suffix: "", decimals: 0 },
	draws: { label: "Games Drawn", suffix: "", decimals: 0 },

	total_user_score: { label: "Total Score", suffix: "", decimals: 0 },
	max_user_score: { label: "Highest Score", suffix: "", decimals: 0 },
	min_user_score: { label: "Lowest Score", suffix: "", decimals: 0 },
	avg_user_score: { label: "Average Score", suffix: "", decimals: 1 },

	total_duration: { label: "Total Playtime", suffix: "m", decimals: 1 },
	max_duration: { label: "Longest Game", suffix: "m", decimals: 0 },
	min_duration: { label: "Shortest Game", suffix: "m", decimals: 0 },
	avg_duration: { label: "Average Game", suffix: "m", decimals: 1 },
} as const;

export function flattenStats(obj: Record<string, any> = {}) {
	return Object.entries(obj)
	  	.filter(([key]) => STAT_CONFIG[key as keyof typeof STAT_CONFIG])
	  	.map(([key, value]) => {
		const config = STAT_CONFIG[key as keyof typeof STAT_CONFIG];
		const displayValue = key.includes('duration') ? secondsToMinutes(value) : value;

		return {
			label: config.label,
			value: displayValue,
			suffix: config.suffix,
		};
	});
};
