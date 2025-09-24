'use client';
import UserInfo from '../components/Main/UserInfo';
import FriendsPanel from '../components/Main/FriendsPanel';
import { motion } from 'framer-motion';
import DashboardGameCards from './components/DashboardGameCards';
import { useAuth } from '../contexts/AuthContext';
import LeaderboardCard from '../components/Main/LeaderBoardCard';
import SnapshotCard from '../components/Main/SnapshotCard';

export default function Dashboard() {
	const { loggedInUser } = useAuth();

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex gap-4 size-full">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<UserInfo firstname={loggedInUser?.username || ''} />
					<section className="hide-scrollbar flex flex-col gap-4 md:overflow-x-hidden">
						<DashboardGameCards />
						<div
							className="hide-scrollbar flex flex-1 flex-col gap-4 lg:flex-row overflow-scroll overflow-x-hidden"
						>
							<LeaderboardCard />
							<SnapshotCard />
						</div>
					</section>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
