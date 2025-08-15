"use client";
import UserInfo from "../components/Main/UserInfo";
import LeaderboardPanel from "../components/Main/LeaderBoardPanel";
import FriendsPanel from "../components/Main/FriendsPanel";
import { motion } from "framer-motion";
import ProfileSnapshot from "../components/Main/ProfileSnapshot";
import DashboardGameCards from "./components/DashboardGameCards";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<div className="flex size-full gap-4">
				<article className="flex h-full w-full flex-5 flex-col gap-4">
					<UserInfo firstname={user?.username || ""} />
					<section className="hide-scrollbar flex flex-col gap-4 md:overflow-x-hidden">
						<DashboardGameCards />
						<div className="mb-6 flex flex-col gap-4 overflow-hidden md:mb-0 md:flex-row">
							<LeaderboardPanel />
							<ProfileSnapshot />
						</div>
					</section>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
