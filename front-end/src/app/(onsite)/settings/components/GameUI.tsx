import { useState } from "react";
import { motion } from "framer-motion";
import PickGame from "../../game/components/Items/PickGame";
import Connectivity from "../../game/components/Items/Connectivity";
import PingPongSelection from "./Items/PingPongSelection";
import TicTacToeSelection from "./Items/TicTacToeSelection";

function GameUI() {
	const [game, setGame] = useState(0);
	const [connectivity, setConnectivity] = useState(0);

	return (
		<motion.div
			className="h-full w-full p-4 flex flex-col gap-3 max-w-220 hide-scrollbar overflow-scroll"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ type: "spring", stiffness: 120 }}
		>
			<div>
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Default customization
				</h2>
				<hr className="border-white/10" />
			</div>
			<PickGame
				label="Default Game"
				game={game}
				setGame={setGame}
				className="lg:gap-20"
			/>
			<Connectivity
				connectivity={connectivity}
				setConnectivity={setConnectivity}
			/>
			{game === 0 ? (
				<PingPongSelection connectivity={connectivity} />
			) : (
				<TicTacToeSelection connectivity={connectivity} />
			)}
		</motion.div>
	);
}

export default GameUI;
