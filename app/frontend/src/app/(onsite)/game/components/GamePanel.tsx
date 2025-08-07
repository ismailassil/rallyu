import { AnimatePresence } from "framer-motion";
import LobbyCard from "./Items/LobbyCard";
import GameField from "./Items/GameField";
import { GameProvider, useGame } from "../contexts/gameContext";

function GamePanel() {
	const { connection } = useGame();
	return (
		<>
			<AnimatePresence>
				<div className="flex flex-col justify-center items-center basis-2/3 w-full h-full rounded-md">
					<GameField />
				</div>
			</AnimatePresence>
			<AnimatePresence>
				<div className="flex basis-1/3 flex-col hide-scrollbar h-full w-full bg-white/3 border border-white/10 rounded-md">
					<LobbyCard /> {/* switch between lobby and chat*/}
				</div>
			</AnimatePresence>
		</>
	);
}

export default GamePanel;
