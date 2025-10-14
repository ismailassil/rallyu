import { useXO } from '../contexts/xoContext';
import GameLoader from './GameLoader';
import Draw from './Items/Draw';
import Wins from './Items/Wins';

const ConfirmButton = () => {
	const { winner, handleStart } = useXO();

	return (
		<>
			<GameLoader />
			<div className="absolute z-10 flex gap-10 items-center justify-center text-md flex-col">
				{!winner || winner.length === 0 ? "" : winner === "draw" ? (
					<Draw />
				) : <Wins winner={winner} img="/profile/lordVoldemort.jpeg" />}
				<div className="flex gap-4">
					<button
						className="py-3 px-6 bg-white/15 rounded-full hover:bg-white/20
							duration-300 cursor-pointer hover:ring-2 ring-white/20"
						onClick={() => {}}
					>
						Go Back
					</button>
					<button
						className="py-3 px-6 bg-blue-600 rounded-full hover:bg-blue-700 
							duration-300 cursor-pointer hover:ring-2 ring-white/20"
						onClick={handleStart}
					>
						Start Game
					</button>
				</div>
			</div>
		</>
	);
};

export default ConfirmButton;
