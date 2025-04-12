"use client";

import { motion } from "framer-motion";
import FriendsPanel from "../components/Main/FriendsPanel";
import Performance from "./components/Performance";
import GamesHistory from "./components/GamesHistory";
import UserPanel from "./components/UserPanel";

export default function Me() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-[100vh] pt-30 pl-6 sm:pl-30 pr-6 pb-24 sm:pb-6"
		>
			<div className="h-full w-full rounded-lg flex gap-6">
				<article className="h-full w-full flex flex-col gap-4 flex-5">
					<UserPanel />
					<div
						className="flex flex-col lg:flex-row space-x-4 space-y-4
							lg:space-y-0 flex-1 overflow-scroll overflow-x-hidden hide-scrollbar"
					>
						<Performance />
						<GamesHistory />
					</div>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
