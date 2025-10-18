import RemoteXO from "./game/RemoteXO";
import LocalXO from "./game/LocalXO";
import { useState } from "react";
import { XOSign } from "../../types/types";
import { Circle, X } from "lucide-react";

const Cell = ({ index, sign, handleMove }: { index: number, sign: XOSign, handleMove: (index: number) => void }) => {
	return (
		<div 
			className="flex rounded-xl bg-card border border-white/2 w-full h-full transform transition-transform duration-200 hover:scale-105 cursor-pointer items-center justify-center"
			onClick={() => handleMove(index)}
		>
			{sign === 'X' && <X className="opacity-80 w-2/3 h-2/3" />}
			{sign === 'O' && <Circle className="opacity-80 w-2/3 h-2/3" />}
		</div>
	)
}

const TicTacToe = ({ tictactoe }: { tictactoe: RemoteXO }) => {
	const [cells, setCells] = useState<XOSign[]>(Array(9).fill(''));


	return (
		<div className="flex justify-center">
			<div className="grid w-[750px] aspect-square grid-cols-3 grid-rows-3 gap-3">
				{cells.map((cell, i) => (
						<Cell index={i} key={i} sign={cell} handleMove={tictactoe.markCell} />
				))}
			</div>
		</div>
	)
}

export default TicTacToe
