'use client';
import UserInfo from '../components/Main/UserInfo';
import LeaderboardPanel from '../components/Main/LeaderBoardPanel';
import FriendsPanel from '../components/Main/FriendsPanel';
import { motion } from 'framer-motion';
import ProfileSnapshot from '../components/Main/ProfileSnapshot';
import DashboardGameCards from './components/DashboardGameCards';
import { useAuth } from '../contexts/AuthContext';
import ProfileSnapshotV2 from '../components/Main/ProfileSnapshotV2';
import { useEffect, useState } from 'react';

export default function Dashboard() {
	const { loggedInUser, apiClient } = useAuth();
	const [userAnalytics, setUserAnalytics] = useState(null);
	const [userAnalyticsByDay, setUserAnalyticsByDay] = useState(null);

	useEffect(() => {
		async function fetchUserSnapshots() {
			try {
				// setIsLoading(true);
				const analytics = await apiClient.fetchUserAnalytics(loggedInUser!.username);
				const analyticsByDay = await apiClient.fetchUserAnalyticsByDay(loggedInUser!.username);
				setUserAnalytics(analytics);
				setUserAnalyticsByDay(analyticsByDay);
				// setIsLoading(false);
			} catch (err) {
				console.log(err);

				// const apiErr = err as APIError;
				// alertError(apiErr.message);
				
			} finally {
				// setIsLoading(false);
			}
		}

		fetchUserSnapshots();
	}, []);

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
						<div className="flex gap-4 overflow-hidden flex-col mb-6 md:mb-0 md:flex-row">
							<LeaderboardPanel />
							<ProfileSnapshotV2 />
						</div>
					</section>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
