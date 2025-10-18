import RemoteXO from "./game/RemoteXO";
import LocalXO from "./game/LocalXO";
import { useEffect } from "react";
import { XOSign } from "../../types/types";
import { Circle, X } from "lucide-react";

const Cell = ({ index, sign, handleMove }: { index: number, sign: XOSign, handleMove: (index: number) => void }) => {
	return (
		<div 
			className="flex rounded-xl bg-card border border-white/2 w-full h-full transform transition-transform duration-200 hover:scale-105 active:scale-98 cursor-pointer items-center justify-center"
			onClick={() => {
				handleMove(index)
			}}
		>
			{sign === 'X' && <X className="opacity-80 w-2/3 h-2/3" />}
			{sign === 'O' && <Circle className="opacity-80 w-2/3 h-2/3" />}
		</div>
	)
}

const TicTacToe = ({ tictactoe, board }: { tictactoe: RemoteXO, board: XOSign[] }) => {


	console.log('Test1');
	useEffect(() => {
		console.log('Test2');
		const unsubscribe = tictactoe.setupCommunications();

		return () => {
			if (unsubscribe) unsubscribe();
		}
	}, []);

	return (
		<div className="flex justify-center items-center">
			<div className="grid w-[750px] aspect-square grid-cols-3 grid-rows-3 gap-3">
				{board.map((cell, i) => (
						<Cell index={i} key={i} sign={cell} handleMove={(i) => tictactoe.markCell(i) } />
				))}
			</div>
		</div>
	)
}

export default TicTacToe
