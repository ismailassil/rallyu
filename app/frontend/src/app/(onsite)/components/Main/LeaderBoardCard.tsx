import LeaderboardItem, { AnimatedLeaderboardItem } from './LeaderBoardItem';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainCardWithHeader from '../../(refactoredUIComponents)/MainCardWithHeader';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderboardCard() {
	const [leaderboard, setLeaderboard] = useState([]);
	const { apiClient } = useAuth();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const t = useTranslations("dashboard.titles");

	useEffect(() => {
		async function fetchLeaderboard() {
			try {
				const data = await apiClient.fetchLeaderboard();
				setLeaderboard(data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchLeaderboard();
	}, []);

	if (leaderboard.length === 0)
		return <h1>Loading...</h1>;

	return (
		<MainCardWithHeader headerName={t("leaderboard")} className='font-funnel-display flex-3 scroll-smooth'>
			<div className="group flex flex-col gap-3 px-6">
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
								position={i}
								img={item.avatar_url}
								username={item.username}
								rank={item.rank}
								score={item.total_xp}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</MainCardWithHeader>
	);
}
