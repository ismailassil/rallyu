'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import useUserProfile from '../context/useUserProfile';
import ProfileCard from '../components/ProfileCard';
import PerformanceCard from '../components/PerformaceCard';
import GamesHistoryCard from '../components/GamesHistoryCard';

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
	const { isLoading, userProfile } = useUserProfile(username);
	
	if (isLoading || !userProfile)
		return <h1 className='top-50 left-7 bg-red-500'>still loading</h1>;

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
						relationStatus={userProfile.user.relation}
						level={userProfile.performance.level}
						globalRank={userProfile.performance.rank || 1337}
						winRate={userProfile.performance.win_rate}
						currentStreak={userProfile.performance.current_streak}
					/>
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						<PerformanceCard 
							totalXP={userProfile.performance.total_xp}
							totalMatches={userProfile.performance.total_matches}
							longestStreak={userProfile.performance.longest_streak}
							wins={userProfile.performance.total_wins}
							losses={userProfile.performance.total_losses}
							draws={userProfile.performance.total_draws}
							timeSpent={timeSpentMockData}
						/>
						<GamesHistoryCard matches={userProfile.matches} />
					</div>
				</article>
				{/* <FriendsPanel /> */}
			</div>
		</motion.main>
	);
}
