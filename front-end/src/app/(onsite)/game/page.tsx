"use client";

import { motion } from "framer-motion";
import InviteFriend from "./components/InviteFriend";
import GamePanel from "./components/GamePanel";

export default function Dashboard() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-[100vh] pt-30 pl-6 sm:pl-30 pr-6 pb-24 sm:pb-6"
		>
			<article className="h-full w-full bg-card rounded-2xl border-2 border-br-card flex justify-center">
				<div className="max-w-300 flex p-4 pl-3 gap-3 md:gap-5 h-full w-full flex-col lg:flex-row">
					<GamePanel />
					<InviteFriend />
				</div>
			</article>
		</motion.main>
	);
}
