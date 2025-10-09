'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/Hero/ProfileCard';
import PerformanceCard from '../components/Performance/PerformaceCard';
import GamesHistoryCard from '../components/GamesHistory/GamesHistoryCard';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError } from '@/app/components/CustomToast';
import { useRouter } from 'next/navigation';
import { EmptyComponent, LoadingPage } from '@/app/(auth)/components/UI/LoadingComponents';
import useAPICall from '@/app/hooks/useAPICall';

export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const router = useRouter();
	const { username } = use(params);

	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.fetchUserByUsername(username));
				setUserProfile(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				if (err.code.includes('USER_NOT_FOUND'))
					router.replace('/404');
				toastError(err.message);
				setError('Failed to load user.');
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserProfile();
	}, [apiClient, executeAPICall, router, username]);

	if (isLoading)
		return <LoadingPage />;

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					{(!isLoading && error) ? (
						<EmptyComponent content={error} />
					) : (!isLoading && !userProfile) ? (
						null
					) : (
						<>
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
						</>
					)}
				</article>
				{/* <FriendsPanel /> */}
			</div>
		</motion.main>
	);
}
