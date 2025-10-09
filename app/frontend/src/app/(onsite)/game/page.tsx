"use client";

import { AnimatePresence, motion } from "framer-motion";
import GamePanel from "./components/GamePanel";
import { GameProvider } from "./contexts/gameContext";

export default function Game() {
	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
			>
				<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="hide-scrollbar flex h-full w-full max-w-500 gap-3 overflow-y-scroll p-4 pl-3 md:gap-5"
					>
						<GameProvider>
							<GamePanel />
						</GameProvider>
					</motion.div>
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
