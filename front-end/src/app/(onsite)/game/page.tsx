"use client";

import { AnimatePresence, motion } from "framer-motion";
import InviteFriend from "./components/InviteFriend";
import GamePanel from "./components/GamePanel";
import { useState } from "react";
import Loading from "./components/Loading";

export default function Dashboard() {
	const [start, setStart] = useState(false);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="h-[100vh] pt-30 pl-6 sm:pl-30 pr-6 pb-24 sm:pb-6"
			>
				<article className="h-full w-full bg-card rounded-2xl border-2 border-br-card flex justify-center">
					{!start ? (
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.2 }}
							className="max-w-300 flex p-4 pl-3 gap-3 md:gap-5 h-full w-full flex-col lg:flex-row overflow-y-scroll hide-scrollbar"
						>
							<GamePanel setStart={setStart} />
							<InviteFriend />
						</motion.div>
					) : (
						<Loading setStart={setStart} />
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
