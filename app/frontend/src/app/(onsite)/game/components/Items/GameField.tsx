import { useGame } from "../../contexts/gameContext";
import Pong from "../pong/Pong";
import TicTacToe from "../tictactoe/TicTacToe";
import VersusCard from "./VersusCard";

const GameField = () => {
	const { gameType } = useGame();

	return (
		<div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
			{/* <PlayerCard img="" name="" side="left"/> */}
			<VersusCard />
			{/* here we should flip between pong and tictactoe */}
			<div className="flex min-h-0 w-full flex-1 items-center justify-center">
				{gameType === "pingpong" ? <Pong /> : <TicTacToe />}
			</div>
		</div>
	);
};

export default GameField;
