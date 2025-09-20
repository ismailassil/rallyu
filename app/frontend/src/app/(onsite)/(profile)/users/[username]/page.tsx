'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';
import PerformanceCard from '../components/PerformaceCard';
import GamesHistoryCard from '../components/GamesHistoryCard';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { alertError } from '@/app/(auth)/components/CustomToast';
import { APIError } from '@/app/(api)/APIClient';
import { UserProfile } from '../../types';
import { AuthLoadingSpinner } from '@/app/(auth)/components/LoadingSpinners';

const timeSpentMockData = [
	{ date: "2023-01-01", timeSpent: 5 },
	{ date: "2023-01-02", timeSpent: 19 },
	{ date: "2023-01-03", timeSpent: 10 },
	{ date: "2023-01-04", timeSpent: 14 },
	{ date: "2023-01-05", timeSpent: 16 },
	{ date: "2023-01-06", timeSpent: 6 },
	{ date: "2023-01-07", timeSpent: 16 }
];

export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const { username } = use(params);
	const { apiClient } = useAuth();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				setIsLoading(true);
				const data = await apiClient.fetchUser(username);
				setUserProfile(data);
				setIsLoading(false);
			} catch (err) {

				const apiErr = err as APIError;
				alertError(apiErr.message);

			} finally {
				setIsLoading(false);
			}
		}

		fetchUserProfile();
	}, []);
	
	if (isLoading || !userProfile)
		return <AuthLoadingSpinner />;

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<ProfileCard 
						user_id={userProfile.user.id}
						fullName={userProfile.user.first_name + ' ' + userProfile.user.last_name}
						username={userProfile.user.username}
						avatarSrc={userProfile.user.avatar_url}
						bio={userProfile.user.bio}
						relationStatus={userProfile.currentRelationship}
						level={userProfile.userRecords.level}
						globalRank={userProfile.userRecords.rank || 1337}
						winRate={userProfile.userStats.win_rate}
						currentStreak={userProfile.userRecords.current_streak}
					/>
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						<PerformanceCard 
							totalXP={userProfile.userRecords.total_xp}
							totalMatches={userProfile.userStats.matches}
							longestStreak={userProfile.userRecords.longest_streak}
							wins={userProfile.userStats.wins}
							losses={userProfile.userStats.losses}
							draws={userProfile.userStats.draws}
							timeSpent={timeSpentMockData}
						/>
						<GamesHistoryCard matches={userProfile.userRecentMatches} />
					</div>
				</article>
				{/* <FriendsPanel /> */}
			</div>
		</motion.main>
	);
}
