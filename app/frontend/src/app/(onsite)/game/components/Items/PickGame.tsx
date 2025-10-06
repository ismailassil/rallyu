import { Hash, PingPong } from "@phosphor-icons/react";
import { motion } from "framer-motion";
// import { useState } from "react";
import { useGame } from "../../contexts/gameContext";

function PickGame() {
	const { gameType, setGameType } = useGame();

	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className={`flex flex-col items-center justify-between gap-2 md:flex-row ${
				"lg:gap-10"
			} lg:min-h-11 text-sm lg:text-base`}
		>
			<div className="flex-3 w-full">
				<div
					className="relative *:flex *:justify-center *:items-center *:px-1
						*:py-1 *:rounded-sm *:gap-1 *:hover:scale-100 *:transform *:transition-all *:duration-300 *:cursor-pointer flex gap-2
						rounded-md border-2 border-white/10 px-1 py-1"
				>
					<div className={`absolute bg-white w-1/2 top-1 bottom-1
					transition-transform ease-initial
					${gameType === "pingpong" ? 'translate-x-0' : 'translate-x-full'}`}>

					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setGameType("pingpong");
						}}
						className={`w-full scale-95 ${gameType === "pingpong" ? "text-black" : "text-white"}`}
					>
						<PingPong size={18} />
						Pong
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setGameType("tictactoe");
						}}
						className={`w-full scale-95 ${gameType === "tictactoe" ? "text-black" : "text-white"}`}
					>
						<Hash size={18} />
						Tic Tac Toe
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default PickGame;
