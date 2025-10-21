'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/Hero/ProfileCard';
import PerformanceCard from '../components/Performance/PerformaceCard';
import GamesHistoryCard from '../components/GamesHistory/GamesHistoryCard';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import LoadingComponent, { PlaceholderComponent } from '@/app/(auth)/components/UI/LoadingComponents';
import FriendsCard from '../../components/Main/FriendsCard/FriendsCard';
import useAPIQuery from '@/app/hooks/useAPIQuery';
import MainCardWrapper from '../../components/UI/MainCardWrapper';

export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const { username } = use(params);

	const {
		apiClient
	} = useAuth();

	const {
		isLoading,
		error,
		data: userProfile
	} = useAPIQuery(
		() => apiClient.user.fetchUserByUsername(username)
	);

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
				<div className="flex h-full w-full gap-6 rounded-lg">
					<article className="flex-5 flex h-full w-full flex-col gap-4">
						{isLoading ? (
							<MainCardWrapper className='h-full w-full'>
								<LoadingComponent />
							</MainCardWrapper>
						) : error ? (
							<MainCardWrapper className='h-full w-full'>
								<PlaceholderComponent content={error} />
							</MainCardWrapper>
						) : userProfile ? (
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
						) : (
							<MainCardWrapper className='h-full w-full'>
								<PlaceholderComponent content='No data available' />
							</MainCardWrapper>
						)}
					</article>
					<FriendsCard />
				</div>

		</motion.main>
	);
}
