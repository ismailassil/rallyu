import Cell from './Items/Cell';
import ConfirmButton from './ConfirmButton';
import Fireworks from './Items/Fireworks';
import { useXO } from '../contexts/xoContext';
import NextRound from './NextRound';

const GameArena = () => {
	const { start, cells, handleMove, show, showBanner } = useXO();

	return (
		<div
			className={`"min-h-200 relative mt-5 flex h-[calc(100%-120px)]	
						w-full items-center justify-center overflow-hidden 
						rounded-2xl border-2 border-white/20 p-10`}
		>
			<Fireworks />
			{!start && <ConfirmButton />}
			{showBanner && <NextRound />}
			<div
				className={`w-150 h-150 grid grid-cols-3 grid-rows-3 gap-5 transition-all duration-300 
					${!show ? 'opacity-100' : 'pointer-events-none select-none opacity-10'}`}
			>
				{cells.map((cell, i) => (
					<Cell index={i} key={i} cell={cell} handleMove={handleMove} />
				))}
			</div>
		</div>
	);
};

export default GameArena;
