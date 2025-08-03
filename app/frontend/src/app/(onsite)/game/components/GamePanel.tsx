import unicaOne from "@/app/fonts/unicaOne";
import { AnimatePresence, motion } from "framer-motion";
import PingPongOptions from "./PingPongOptions";
import TicTacToeOptions from "./TicTacToeOptions";
import QueueButton from "./Items/QueueButton";
import GameStyle from "./Items/GameStyle";
import PickGame from "./Items/PickGame";
import { useGameContext } from "../contexts/gameContext";
import { useTicTacToe } from "../../contexts/tictactoeContext";
import { usePingPong } from "../../contexts/pingpongContext";

function GamePanel() {
	const { gameType } = useGameContext();
	const { connectivity: tConnect, setConnectivity: updatetConnect } = useTicTacToe();
	const { connectivity: pConnect, setConnectivity: updatepConnect } = usePingPong();

	return (
		<AnimatePresence>
			<div className="hide-scrollbar flex h-full flex-1 flex-col">
				<h1 className={`p-4 text-4xl ${unicaOne.className} font-semibold uppercase`}>
					<span className="font-semibold">Customize Your World!</span>
				</h1>
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1, delay: 0.1 }}
					className={`custom-scroll flex h-full flex-col gap-5 overflow-y-scroll p-4`}
				>
					<PickGame label="Pick Your Game" />
					<GameStyle
						connectivity={gameType === "pingpong" ? pConnect : tConnect}
						setConnectivity={gameType === "pingpong" ? updatepConnect : updatetConnect}
					/>
					{gameType === "pingpong" ? <PingPongOptions /> : <TicTacToeOptions />}
				</motion.div>
				<QueueButton onToggle={null}/>
			</div>
		</AnimatePresence>
	);
}

export default GamePanel;
