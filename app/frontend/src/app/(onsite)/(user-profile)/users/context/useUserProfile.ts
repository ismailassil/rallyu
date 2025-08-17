/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

// export type UserProfileType = {
//     user: {
//         id: number,
//         first_name: string
//         last_name: string
//         email: string
//         username: string
//         bio: string
//         avatar_path: string
//         role: string
//     }
//     friendship_status: null | string
//     stats: {
//         user: {
//             id: number
//             rank: number,
//             level: number
//             total_xp: number
//             current_streak: number
//             longest_streak: number
//             user_id: number
//         }
//         matches: {
//             matches: number
//             wins: number
//             losses: number
//             draws: number
//             win_rate: number
//         }
//     }
//     matches: Array<{
//         match_id: number
//         game_type: string
//         started_at: string
//         finished_at: string
//         user_id: number
//         user_username: string
//         user_score: number
//         opp_score: number
//         opponent_id: number
//         opponent_username: string
//         duration: number
//         outcome: string
//     }>
// }

type UserProfile = {
	user: User,
	performance: UserPerformance,
	matches: Array<UserGame>
}

type User = {
	id: number,
	first_name: string
	last_name: string
	email: string
	username: string
	bio: string
	avatar_path: string
	avatar_url: string
	relation: string | null
}

type UserPerformance = {
	rank: number
	level: number
	total_xp: number
	current_streak: number
	longest_streak: number
	total_matches: number
	total_wins: number
	total_losses: number
	total_draws: number
	win_rate: number
}

type UserGame = {
	match_id: number
	game_type: string
	started_at: string
	finished_at: string
	user_id: number
	user_username: string
	user_score: number
	opp_score: number
	opponent_username: string
	opponent_id: number
	duration: number
	outcome: string
}

export default function useUserProfile(username: string) : { isLoading: boolean, userProfile: UserProfile | null } {
	const { apiClient } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		async function initializeUserProfile(username: string) {
			try {
				setIsLoading(true);
				const usr = await apiClient.fetchUser(username);
				const matchesPage = await apiClient.fetchUserMatchesPage(username, 1);
				const performance = await apiClient.fetchUserPerformance(username);
	
				// TODO: SHOULD BE DONE SOMEWHERE ELSE
				if (usr.avatar_path[0] == '/')
					usr.avatar_url = 'http://localhost:4025/api/users' + usr.avatar_path;
				// const userAvatarBlob = await apiClient.getUserAvatar(user.avatar_path);
				// const userAvatarURL = URL.createObjectURL(userAvatarBlob);
				// user.avatar_url = userAvatarURL;
	
				setUserProfile({ user: usr, performance, matches: matchesPage });
			} catch {
				setUserProfile(null);
				// TODO: TOAST ERROR
			} finally {
				setIsLoading(false);
			}
		}
		
		initializeUserProfile(username);
	}, [username]);

	return {
		isLoading,
		userProfile
	};
}
