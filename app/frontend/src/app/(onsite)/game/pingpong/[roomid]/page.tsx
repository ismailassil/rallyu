"use client";

import { motion } from "framer-motion";
import GameField from "../local/components/GameField";

const Game = () => {

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
				<GameField  />
			</article>
		</motion.main>
	);
};

export default Game;