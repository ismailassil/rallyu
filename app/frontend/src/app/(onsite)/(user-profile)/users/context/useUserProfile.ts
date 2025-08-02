/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

export type UserProfileType = {
    user: {
        id: number,
        first_name: string
        last_name: string
        email: string
        username: string
        bio: string
        avatar_path: string
        role: string
    }
    friendship_status: null | string
    stats: {
        user: {
            id: number
            rank: number,
            level: number
            total_xp: number
            current_streak: number
            longest_streak: number
            user_id: number
        }
        matches: {
            matches: number
            wins: number
            losses: number
            draws: number
            win_rate: number
        }
    }
    matches: Array<{
        match_id: number
        game_type: string
        started_at: string
        finished_at: string
        user_id: number
        user_username: string
        user_score: number
        opp_score: number
        opponent_id: number
        opponent_username: string
        duration: number
        outcome: string
    }>
}

export default function useUserProfile(username: string) : { isLoading: boolean, userProfile: UserProfileType | null } {
	const { api } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		console.log('useEffect in useUserProfile');
		initializeUserProfile(username);
	}, [username]);

	async function initializeUserProfile(username: string) {
		try {
			const userProfile = await api.getUser(username);
            // const userAvatar = await api.getUserAvatar(userProfile.user.avatar_path);
            // const avatarBlob = await userAvatar.blob();
            // const avatarURL = URL.createObjectURL(avatarBlob);
            // console.log(avatarURL);
			setUserProfile(userProfile);
			// setUserProfile(userProfile);
		} catch {
			setUserProfile(null);
		} finally {
			setIsLoading(false);
		}
	}

	return {
		isLoading,
		userProfile
	};
}
