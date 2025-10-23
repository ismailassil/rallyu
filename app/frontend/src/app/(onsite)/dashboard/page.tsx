"use client";
import UserInfo from "./components/Hero/UserInfo";
import { motion } from "framer-motion";
import DashboardGameCards from "./components/GamesCards/DashboardGameCards";
import { useAuth } from "../contexts/AuthContext";
import LeaderboardCard from "./components/Leaderboard/LeaderBoardCard";
import SnapshotCard from "./components/Snapshots/SnapshotCard";
import FriendsCard from "../components/Main/FriendsCard/FriendsCard";

export default function Dashboard() {
	const { loggedInUser } = useAuth();

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<div className="flex size-full gap-4">
				<article className="flex h-full w-full flex-5 flex-col gap-4">
					<UserInfo firstname={loggedInUser?.username || ""} />
					<section className="hide-scrollbar flex flex-1 flex-col gap-4 md:overflow-x-hidden">
						<DashboardGameCards />
						<div className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-scroll overflow-x-hidden lg:flex-row mb-25 sm:mb-0">
							<LeaderboardCard />
							<SnapshotCard />
						</div>
					</section>
				</article>
				<FriendsCard />
			</div>
		</motion.main>
	);
}
