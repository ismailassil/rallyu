import { useXO } from '../contexts/xoContext';
import GameLoader from './GameLoader';

const NextRound = () => {
	const { handleNextRound } = useXO();

	return (
		<>
			<GameLoader />
				<button
					className="absolute z-10 flex gap-14 items-center justify-center text-xl flex-col py-3 px-6 bg-blue-600 rounded-full hover:bg-blue-700 
						duration-300 cursor-pointer hover:ring-2 ring-white/20"
					onClick={handleNextRound}
				>
					Next Round
				</button>
		</>
	);
};

export default NextRound;
