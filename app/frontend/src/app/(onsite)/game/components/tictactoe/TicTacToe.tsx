"use client";

import { AnimatePresence } from "framer-motion";
// import GameInfo from "./components/GameInfo";
import { XOProvider } from "./contexts/xoContext";
import GameArena from "./components/GameArena";

function TicTacToe() {
	return (
		<AnimatePresence>
			<article className="hide-scrollbar max-h-full max-w-full size-auto flex flex-col justify-center overflow-hidden overflow-y-scroll">
				<XOProvider>
					<section className="flex max-w-400 flex-col gap-3 p-5">
						{/* <GameInfo /> */}
						<GameArena />
					</section>
				</XOProvider>
			</article>
		</AnimatePresence>
	);
}

export default TicTacToe;
