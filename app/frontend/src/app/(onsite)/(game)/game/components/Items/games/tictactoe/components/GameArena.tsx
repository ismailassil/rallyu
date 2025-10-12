import Cell from "./Items/Cell";
import ConfirmButton from "./ConfirmButton";
import Fireworks from "./Items/Fireworks";
import { useXO } from "../contexts/xoContext";
import NextRound from "./NextRound";

const GameArena = () => {
	const { start, cells, handleMove, show, showBanner } = useXO();

	return (
		<div
			className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl p-5`}
		>
			<Fireworks />
			{/* {!start && <ConfirmButton />} */}
			{showBanner && <NextRound />}
			<div
				className={`grid h-150 w-150 grid-cols-3 grid-rows-3 gap-5 transition-all duration-300`}
			>
				{cells.map((cell, i) => (
					<Cell index={i} key={i} cell={cell} handleMove={handleMove} />
				))}
			</div>
		</div>
	);
};

export default GameArena;
