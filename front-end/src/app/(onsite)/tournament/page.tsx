"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Loading from "../game/components/Loading";
import TournamentPanel from "./components/TournamentPanel";

export default function Dashboard() {
	const [start, setStart] = useState(false);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
					{!start ? (
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.2 }}
							className="max-w-300 hide-scrollbar flex h-full w-full flex-col gap-3 overflow-y-scroll p-4 pl-3 md:gap-5"
						>
							<TournamentPanel />
						</motion.div>
					) : (
						<Loading setStart={setStart} />
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
