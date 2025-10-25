import LeaderboardItem from './LeaderBoardItem';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import MainCardWithHeader from '../../../components/UI/MainCardWithHeader';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import useAPICall from '@/app/hooks/useAPICall';
import { PlaceholderComponent } from '@/app/(auth)/components/UI/LoadingComponents';
import { LoadingSkeletonList } from './LeaderBoardSkeleton';

export default function LeaderboardCard() {
	const t = useTranslations("dashboard.titles");

	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall,
		isLoading,
		data: leaderboard,
		error
	} = useAPICall();

	useEffect(() => {
		async function fetchLeaderboard() {
			try {
				await executeAPICall(() => apiClient.user.fetchLeaderboard());
			} catch (err) {
				void err;
			}
		}
		fetchLeaderboard();
	}, []);

	return (
		<MainCardWithHeader headerName={t("leaderboard")} className='font-funnel-display flex-3 scroll-smooth'>
			<div className="group flex flex-col gap-3 px-6">
				{isLoading ? (
					<LoadingSkeletonList
						count={10}
					/>
				) : error ? (
					<PlaceholderComponent content={error} />
				) : !leaderboard ? (
					null
				) : leaderboard.length === 0 ? (
					<PlaceholderComponent content={'No leaderboard found. Go touch some grass.'} />
				) : (
					<AnimatePresence>
						{leaderboard.map((item, i) => (
							<motion.div
								key={item.username}
								initial={{ opacity: 0, y: -40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: i * 0.15 }}
								style={{ zIndex: leaderboard.length - i }}
								className='bg-red-500/0'
							>
								<LeaderboardItem
									userId={item.id}
									position={i}
									img={item.avatar_url}
									username={item.username}
									rank={item.rank}
									score={item.total_xp}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>
		</MainCardWithHeader>
	);
}
