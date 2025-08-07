"use client";

import { AnimatePresence, motion } from "framer-motion";
import GamePanel from "./components/GamePanel";
import { GameProvider } from "./contexts/gameContext";

export default function Game() {
	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article
					className="bg-card border-br-card flex h-full w-full justify-center items-center
							rounded-2xl border-2"
				>
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.2 }}
						// <div className="flex w-full h-full gap-4 flex-col lg:justify-center items-center xl:flex-row"></div>
						className="2xl:max-w-[75vw] max-w-[999vw] hide-scrollbar flex flex-col lg:flex-row
						lg:justify-center items-center h-full w-full
						gap-3 overflow-scroll p-4 pl-3"
					>
						<GameProvider>
							<GamePanel />
						</GameProvider>
					</motion.div>
				</article>
			</motion.main>
		</AnimatePresence>
	);
	// return (
	// 	<AnimatePresence>
	// 	<motion.main
	// 		initial={{ opacity: 0, y: -50 }}
	// 		animate={{ opacity: 1, y: 0 }}
	// 		transition={{ duration: 1, delay: 0.5 }}
	// 		className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
	// 	>
	// 		<article
	// 			className="bg-card border-br-card flex h-full w-full justify-center
	// 					rounded-2xl border-2"
	// 		>
				
	// 		</article>
	// 	</motion.main>
	// </AnimatePresence>
	// );
}
