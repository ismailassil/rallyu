'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';
import PerformanceCard from '../components/PerformaceCard';
import GamesHistoryCard from '../components/GamesHistoryCard';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError } from '@/app/components/CustomToast';
import { APIError } from '@/app/(api)/APIClient';
import { UserProfile } from '../../types';
import { AuthLoadingSpinner } from '@/app/(auth)/components/LoadingSpinners';
import { useRouter } from 'next/navigation';

export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const router = useRouter();
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
			} catch (err) {
				const apiErr = err as APIError;
				if (apiErr.code.includes('USER_NOT_FOUND'))
					router.replace('/404');
				toastError(apiErr.message);
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserProfile();
	}, [username, apiClient, router]);

	useEffect(() => {
		if (!isLoading && !userProfile) {
			router.replace('/404');
		}
	}, [isLoading, userProfile, router]);
	
	if (isLoading)
		return <AuthLoadingSpinner />;
	if (!userProfile)
		return null;

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
						userId={userProfile.user.id}
						fullName={userProfile.user.first_name + ' ' + userProfile.user.last_name}
						username={userProfile.user.username}
						avatar={userProfile.user.avatar_url}
						bio={userProfile.user.bio}
						friendshipStatus={userProfile.currentRelationship}
						level={userProfile.userRecords.level}
						globalRank={userProfile.userRecords.rank}
						winRate={userProfile.userStats.win_rate}
						currentStreak={userProfile.userRecords.current_streak}
					/>
					<div
						className="hide-scrollbar flex flex-1 flex-col gap-4 lg:flex-row overflow-scroll overflow-x-hidden"
					>
						<PerformanceCard 
							totalXP={userProfile.userRecords.total_xp}
							totalMatches={userProfile.userStats.matches}
							longestStreak={userProfile.userRecords.longest_streak}
							wins={userProfile.userStats.wins}
							losses={userProfile.userStats.losses}
							draws={userProfile.userStats.draws}
							timeSpent={userProfile.userRecentTimeSpent}
						/>
						<GamesHistoryCard matches={userProfile.userRecentMatches} />
					</div>
				</article>
				{/* <FriendsPanel /> */}
			</div>
		</motion.main>
	);
}
