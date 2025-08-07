"use client";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import GameInfo from "./components/GameInfo";
import GameField from "./components/GameField";
import { XOProvider } from "./contexts/xoContext";
import { useState } from "react";
import Congrats from "./components/Congrats";

type gameInfoType = {
	pl1: number;
	pl2: number;
	round: number;
	turn: "pl1" | "pl2";
};

function Page() {
	const [gameInfo, setGameInfo] = useState<gameInfoType>({
		pl1: 0,
		pl2: 0,
		round: 1,
		turn: "pl1",
	});
	const [gameEnd, setGameEnd] = useState(false);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 0.2 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article
					className="bg-card border-br-card hide-scrollbar flex h-full w-full
					justify-center overflow-hidden overflow-y-scroll rounded-2xl border-2"
				>
					{/* <TicTacToe /> */}
					{!gameEnd ? (
						<section className="max-w-300 flex h-full w-full flex-col gap-3 p-5">
							<XOProvider>
								<GameInfo gameInfo={gameInfo} />
								<GameField
									gameInfo={gameInfo}
									setGameInfo={setGameInfo}
									setGameEnd={setGameEnd}
								/>
							</XOProvider>
						</section>
					) : (
						<section
							className="max-w-300 flex h-full w-full flex-col
								items-center justify-center gap-3 p-5"
						>
							<Congrats
								gameInfo={gameInfo}
								setGameInfo={setGameInfo}
								setGameEnd={setGameEnd}
							/>
						</section>
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}

export default Page;
