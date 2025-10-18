import RemoteXO from "./game/RemoteXO";
import LocalXO from "./game/LocalXO";
import { useEffect } from "react";
import { XOSign } from "../../types/types";
import { Circle, X } from "lucide-react";
import { motion } from "framer-motion";

const Cell = ({ index, sign, handleMove }: { index: number, sign: XOSign, handleMove: (index: number) => void }) => {
	return (
		<div
			className="flex rounded-xl bg-card border border-white/20 w-full h-full transform transition-transform duration-200 hover:scale-105 active:scale-98 cursor-pointer items-center justify-center"
			onClick={() => handleMove(index)}
		>
			{sign === 'X' && (
				<motion.div
				key="X"
				initial={{ scale: 0, rotate: -180, opacity: 0 }}
				animate={{ scale: 1, rotate: 0, opacity: 0.8 }}
				exit={{ scale: 0, opacity: 0 }}
				transition={{ type: "spring", stiffness: 120, damping: 18 }}
				className="w-2/3 h-2/3 flex items-center justify-center"
				>
				<X className="w-full h-full" />
				</motion.div>
			)}

			{sign === 'O' && (
				<motion.div
				key="O"
				initial={{ scale: 0, rotate: 180, opacity: 0 }}
				animate={{ scale: 1, rotate: 0, opacity: 0.8 }}
				exit={{ scale: 0, opacity: 0 }}
				transition={{ type: "spring", stiffness: 120, damping: 18 }}
				className="w-2/3 h-2/3 flex items-center justify-center"
				>
				<Circle className="w-full h-full" />
				</motion.div>
			)}
		</div>
	)
}

const TicTacToe = ({ tictactoe, board }: { tictactoe: RemoteXO, board: XOSign[] }) => {

	useEffect(() => {
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
