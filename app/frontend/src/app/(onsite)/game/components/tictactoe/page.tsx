"use client";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import GameInfo from "./components/GameInfo";
import { XOProvider } from "./contexts/xoContext";
import GameArena from "./components/GameArena";

function Page() {

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 0.2 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article
					className="flex-col bg-card border-br-card hide-scrollbar flex h-full w-full
					justify-center overflow-hidden overflow-y-scroll rounded-2xl border-2"
				>
					<XOProvider>
						<section className="max-w-300 flex h-full w-full flex-col gap-3 p-5">
							<GameInfo />
							<GameArena />
						</section>
					</XOProvider>
				</article>
			</motion.main>
		</AnimatePresence>
	);
}

export default Page;
